import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateText, stepCountIs, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { CarriersService } from '../carriers/carriers.service';
import { OperatorsService } from '../operators/operators.service';
import { TerminalsService } from '../terminals/terminals.service';
import { CreateBookingDto, BookingResponseDto } from '../bookings/dto';
import { BookingStatus, UserRole } from '../../common/enums';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatMessage } from './entities/chat-message.entity';

type RequestUser = {
    id: string;
    email: string;
    role: UserRole | string;
};

type ChatHistoryMessage = {
    role: 'user' | 'assistant';
    content: string;
};

type BookingConfirmationPayload = {
    confirmationId: string;
    expiresAt: string;
    booking: {
        terminalId: string;
        terminalName: string;
        truckId: string;
        truckPlate: string;
        driverId: string;
        driverName: string;
        slotStart: string;
        slotEnd: string;
        slotsCount: number;
        containerMatricule?: string | null;
    };
};

type PendingBookingConfirmation = {
    id: string;
    userId: string;
    carrierId: string;
    createdAt: Date;
    expiresAt: Date;
    createDto: CreateBookingDto;
    terminalName: string;
    truckPlate: string;
    driverName: string;
    slotEnd: Date;
};

const BOOKING_CONFIRMATION_TTL_MS = 10 * 60 * 1000;
const CHAT_HISTORY_MAX_MESSAGES = 20;

@Injectable()
export class AiAgentService {
    private pendingBookingConfirmations = new Map<string, PendingBookingConfirmation>();

    constructor(
        @InjectRepository(ChatConversation)
        private readonly chatConversationsRepository: Repository<ChatConversation>,
        @InjectRepository(ChatMessage)
        private readonly chatMessagesRepository: Repository<ChatMessage>,
        private readonly usersService: UsersService,
        private readonly bookingsService: BookingsService,
        private readonly carriersService: CarriersService,
        private readonly operatorsService: OperatorsService,
        private readonly terminalsService: TerminalsService,
    ) { }

    async chat(input: { message: string; user: RequestUser | null | undefined; conversationId?: string }): Promise<{ response: string; confirmation?: BookingConfirmationPayload; conversationId: string }> {
        if (!input.user?.id) {
            throw new UnauthorizedException();
        }

        const tools = this.buildTools(input.user);

        const system = this.buildSystemPrompt();

        const temperature = this.getNumberEnv('AI_TEMPERATURE', 0.2);
        const maxOutputTokens = this.getNumberEnv('AI_MAX_OUTPUT_TOKENS', 600);

        const conversation = await this.getOrCreateConversation(input.user.id, input.conversationId);
        const historyMessages = await this.loadRecentMessages(conversation.id, CHAT_HISTORY_MAX_MESSAGES);
        const messages = [...historyMessages, { role: 'user' as const, content: input.message }];

        let result;
        try {
            result = await generateText({
                model: google(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'),
                system,
                messages,
                tools,
                temperature,
                maxOutputTokens,
                stopWhen: stepCountIs(8),
            });
        } catch (error: any) {
            const message = this.formatAiError(error);
            return this.finalizeResponse({
                conversation,
                userMessage: input.message,
                responseText: message,
            });
        }

        const prepareBookingResult = result.toolResults.find(
            (res) => res.toolName === 'prepare_booking',
        ) as any;

        if (prepareBookingResult?.output?.confirmationId) {
            const output = prepareBookingResult.output as BookingConfirmationPayload;
            const responseText = this.formatBookingConfirmation(output.booking);
            return this.finalizeResponse({
                conversation,
                userMessage: input.message,
                responseText,
                confirmation: output,
            });
        }

        if (prepareBookingResult?.output?.error) {
            const error = prepareBookingResult.output.error as string;
            return this.finalizeResponse({
                conversation,
                userMessage: input.message,
                responseText: error,
            });
        }

        const text = result.text?.trim();
        if (text) {
            return this.finalizeResponse({
                conversation,
                userMessage: input.message,
                responseText: text,
            });
        }

        const toolFallback = this.formatToolResults(result.toolResults);
        if (toolFallback) {
            return this.finalizeResponse({
                conversation,
                userMessage: input.message,
                responseText: toolFallback,
            });
        }

        const fallback = 'Aucune reponse.';
        return this.finalizeResponse({
            conversation,
            userMessage: input.message,
            responseText: fallback,
        });
    }

    private buildSystemPrompt(): string {
        const today = new Date().toISOString().slice(0, 10);
        return [
            'You are an internal backend administrator AI agent embedded in a NestJS API.',
            'You have access to a set of tools that call real backend services and return real data.',
            'You MUST use the provided tools to fetch or change data; do not invent database results.',
            `Today is ${today}.`,
            'Security rules:',
            '- Act strictly on behalf of the authenticated user context provided by the system.',
            '- Never access or modify resources the user is not authorized to access.',
            '- Admin-only actions require the user role ADMIN.',
            'Tool usage rules:',
            '- Use tools when you need factual data or to perform an action.',
            '- If asked about availability or slots, use the terminal availability tool.',
            '- Validate inputs using the tool schemas; if required data is missing, ask a clarifying question instead of guessing.',
            '- If a tool returns an error, explain it in plain language and propose next steps.',
            'Booking rules:',
            '- When a user asks to create a booking/reservation, gather: terminal name, date/time, truck plate, driver name, optional container, slots count.',
            '- Use the prepare_booking tool to create a confirmation request.',
            '- Never finalize a booking without explicit user confirmation.',
            'Response style:',
            '- Keep responses concise and actionable.',
            '- When listing items, present a compact table.',
            'When displaying bookings or users, ALWAYS use Markdown tables.',
            'Include key columns like ID, Reference, Status, and Date.',
        ].join('\n');
    }

    private buildTools(user: RequestUser) {
        const requireAdmin = () => {
            if (user.role !== UserRole.ADMIN) {
                throw new UnauthorizedException('Admin privileges required');
            }
        };

        const getCarrierIdForUser = async (): Promise<string> => {
            const carrier = await this.carriersService.findByUserId(user.id);
            if (!carrier) {
                throw new UnauthorizedException('No carrier profile is associated with your account');
            }
            return carrier.id;
        };

        const getTerminalIdForUser = async (): Promise<string> => {
            const operator = await this.operatorsService.findByUserId(user.id);
            if (!operator) {
                throw new UnauthorizedException('No operator profile is associated with your account');
            }
            return operator.terminalId;
        };

        const requireCarrierOrAdmin = () => {
            if (![UserRole.ADMIN, UserRole.CARRIER].includes(user.role as UserRole)) {
                throw new UnauthorizedException('Your role is not allowed to create bookings');
            }
        };

        const resolveCarrierId = async (explicitCarrierId?: string): Promise<string> => {
            if (user.role === UserRole.ADMIN) {
                if (!explicitCarrierId) {
                    throw new BadRequestException('carrierId is required for admin booking actions');
                }
                return explicitCarrierId;
            }
            return getCarrierIdForUser();
        };

        const matchByName = <T extends { id: string }>(
            items: T[],
            input: string,
            getName: (item: T) => string,
        ): T[] => {
            const normalized = input.trim().toLowerCase();
            const tokens = normalized.split(/\s+/).filter(Boolean);
            return items.filter((item) => {
                const name = getName(item).trim().toLowerCase();
                if (!name) return false;
                if (name === normalized) return true;
                if (name.includes(normalized)) return true;
                if (normalized.includes(name)) return true;
                return tokens.some((token) => name.includes(token));
            });
        };

        const normalizePlate = (value: string) => value.replace(/[^a-z0-9]/gi, '').toUpperCase();

        return {
            get_my_profile: tool({
                description: 'Get the current authenticated user profile.',
                inputSchema: z.object({}),
                outputSchema: z.any(),
                execute: async () => {
                    try {
                        return await this.usersService.findOne(user.id);
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to fetch profile' };
                    }
                },
            }),

            list_users: tool({
                description: 'List all users. Admin only. Optional filter by role.',
                inputSchema: z.object({
                    role: z.nativeEnum(UserRole).optional(),
                }),
                outputSchema: z.any(),
                execute: async ({ role }) => {
                    try {
                        requireAdmin();
                        return await this.usersService.findAll(role);
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to list users' };
                    }
                },
            }),

            get_booking_by_reference: tool({
                description: 'Get booking details by booking reference (e.g., BK-ABC123).',
                inputSchema: z.object({
                    reference: z.string().min(1),
                }),
                outputSchema: z.any(),
                execute: async ({ reference }) => {
                    try {
                        const booking = await this.bookingsService.findByReference(reference);

                        if (user.role === UserRole.ADMIN) {
                            return booking;
                        }

                        if (user.role === UserRole.CARRIER) {
                            const carrierId = await getCarrierIdForUser();
                            if ((booking as any).carrierId && (booking as any).carrierId !== carrierId) {
                                throw new UnauthorizedException('You are not allowed to access this booking');
                            }
                            return booking;
                        }

                        if (user.role === UserRole.OPERATOR) {
                            const terminalId = await getTerminalIdForUser();
                            if ((booking as any).terminalId && (booking as any).terminalId !== terminalId) {
                                throw new UnauthorizedException('You are not allowed to access this booking');
                            }
                            return booking;
                        }

                        throw new UnauthorizedException('You are not allowed to access booking details');
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to fetch booking' };
                    }
                },
            }),

            list_bookings: tool({
                description: 'List bookings visible to the current user. Carriers/operators are automatically scoped to their carrier/terminal.',
                inputSchema: z.object({
                    status: z.nativeEnum(BookingStatus).optional(),
                }),
                outputSchema: z.any(),
                execute: async ({ status }) => {
                    try {
                        if (user.role === UserRole.ADMIN) {
                            return await this.bookingsService.findAll(user.id, UserRole.ADMIN, undefined, undefined, status);
                        }

                        if (user.role === UserRole.CARRIER) {
                            const carrierId = await getCarrierIdForUser();
                            return await this.bookingsService.findAll(user.id, UserRole.CARRIER, carrierId, undefined, status);
                        }

                        if (user.role === UserRole.OPERATOR) {
                            const terminalId = await getTerminalIdForUser();
                            return await this.bookingsService.findAll(user.id, UserRole.OPERATOR, undefined, terminalId, status);
                        }

                        throw new UnauthorizedException('Your role is not allowed to list bookings');
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to list bookings' };
                    }
                },
            }),

            list_my_trucks: tool({
                description: 'List trucks for the current carrier. Admin can specify carrierId.',
                inputSchema: z.object({
                    carrierId: z.string().optional(),
                }),
                outputSchema: z.any(),
                execute: async ({ carrierId }) => {
                    try {
                        requireCarrierOrAdmin();
                        const resolvedCarrierId = await resolveCarrierId(carrierId);
                        const trucks = await this.carriersService.getTrucks(resolvedCarrierId);
                        return trucks.map((truck: any) => ({
                            id: truck.id,
                            plateNumber: truck.plateNumber,
                            status: truck.status,
                        }));
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to list trucks' };
                    }
                },
            }),

            list_my_drivers: tool({
                description: 'List drivers for the current carrier. Admin can specify carrierId.',
                inputSchema: z.object({
                    carrierId: z.string().optional(),
                }),
                outputSchema: z.any(),
                execute: async ({ carrierId }) => {
                    try {
                        requireCarrierOrAdmin();
                        const resolvedCarrierId = await resolveCarrierId(carrierId);
                        const drivers = await this.carriersService.getDrivers(resolvedCarrierId);
                        return drivers.map((driver: any) => ({
                            id: driver.id,
                            fullName: driver.user?.fullName ?? 'Unknown',
                            email: driver.user?.email,
                            status: driver.status,
                        }));
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to list drivers' };
                    }
                },
            }),

            prepare_booking: tool({
                description:
                    'Prepare a booking draft that requires user confirmation before creating it.',
                inputSchema: z.object({
                    terminalName: z.string().optional(),
                    terminalId: z.string().optional(),
                    date: z.string().optional(),
                    time: z.string().optional(),
                    slotStart: z.string().optional(),
                    truckPlate: z.string().optional(),
                    truckId: z.string().optional(),
                    driverName: z.string().optional(),
                    driverId: z.string().optional(),
                    slotsCount: z.number().int().min(1).optional(),
                    containerMatricule: z.string().optional(),
                    carrierId: z.string().optional(),
                }),
                outputSchema: z.any(),
                execute: async (input) => {
                    try {
                        requireCarrierOrAdmin();

                        const resolvedCarrierId = await resolveCarrierId(input.carrierId);

                        const terminals = await this.terminalsService.findAll();
                        let terminalMatch = null as any;
                        if (input.terminalId) {
                            terminalMatch = terminals.find((t) => t.id === input.terminalId);
                        } else if (input.terminalName) {
                            const matches = matchByName(terminals, input.terminalName, (t) => t.name);
                            if (matches.length > 1) {
                                return {
                                    error: 'Multiple terminals match. Please provide the full terminal name.',
                                    terminals: matches.map((t) => ({ id: t.id, name: t.name })),
                                };
                            }
                            terminalMatch = matches[0];
                        }

                        if (!terminalMatch) {
                            return {
                                error: 'Terminal not found. Please provide a valid terminal name.',
                                availableTerminals: terminals.map((t) => t.name),
                            };
                        }

                        const terminalEntity = await this.terminalsService.findOneEntity(terminalMatch.id);

                        const trucks = await this.carriersService.getTrucks(resolvedCarrierId);
                        let truckMatch = null as any;
                        if (input.truckId) {
                            truckMatch = trucks.find((t) => t.id === input.truckId);
                        } else if (input.truckPlate) {
                            const normalized = normalizePlate(input.truckPlate);
                            const matches = trucks.filter((t) => normalizePlate(t.plateNumber).includes(normalized));
                            if (matches.length > 1) {
                                return {
                                    error: 'Multiple trucks match that plate. Please specify the full plate number.',
                                    trucks: matches.map((t) => ({ id: t.id, plateNumber: t.plateNumber })),
                                };
                            }
                            truckMatch = matches[0];
                        }

                        if (!truckMatch) {
                            return {
                                error: 'Truck not found. Please provide a valid truck plate.',
                                availableTrucks: trucks.map((t) => t.plateNumber),
                            };
                        }

                        const drivers = await this.carriersService.getDrivers(resolvedCarrierId);
                        let driverMatch = null as any;
                        if (input.driverId) {
                            driverMatch = drivers.find((d) => d.id === input.driverId);
                        } else if (input.driverName) {
                            const matches = matchByName(
                                drivers,
                                input.driverName,
                                (d) => d.user?.fullName ?? '',
                            );
                            if (matches.length > 1) {
                                return {
                                    error: 'Multiple drivers match that name. Please specify the full name.',
                                    drivers: matches.map((d) => ({
                                        id: d.id,
                                        fullName: d.user?.fullName ?? 'Unknown',
                                    })),
                                };
                            }
                            driverMatch = matches[0];
                        }

                        if (!driverMatch) {
                            return {
                                error: 'Driver not found. Please provide a valid driver name.',
                                availableDrivers: drivers.map((d) => d.user?.fullName ?? 'Unknown'),
                            };
                        }

                        const slotStart = this.resolveSlotStart(input.slotStart, input.date, input.time);
                        if (!slotStart) {
                            return {
                                error: 'Missing or invalid slot date/time. Provide slotStart or date + time (HH:MM).',
                            };
                        }

                        const slotsCount = input.slotsCount ?? 1;
                        const slotEnd = new Date(slotStart);
                        slotEnd.setMinutes(slotEnd.getMinutes() + terminalEntity.port.slotDuration * slotsCount);

                        const createDto: CreateBookingDto = {
                            terminalId: terminalEntity.id,
                            truckId: truckMatch.id,
                            driverId: driverMatch.id,
                            slotStart,
                            slotsCount,
                            containerMatricule: input.containerMatricule,
                        };

                        return this.createBookingConfirmation({
                            userId: user.id,
                            carrierId: resolvedCarrierId,
                            createDto,
                            terminalName: terminalEntity.name,
                            truckPlate: truckMatch.plateNumber,
                            driverName: driverMatch.user?.fullName ?? 'Unknown',
                            slotEnd,
                        });
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to prepare booking' };
                    }
                },
            }),

            get_terminal_availability: tool({
                description:
                    'Check slot availability for a terminal on a date. Optionally filter by time range (HH:MM).',
                inputSchema: z.object({
                    terminalName: z.string().min(1),
                    date: z.string().optional(),
                    startTime: z.string().optional(),
                    endTime: z.string().optional(),
                }),
                outputSchema: z.any(),
                execute: async ({ terminalName, date, startTime, endTime }) => {
                    try {
                        const terminals = await this.terminalsService.findAll();
                        const normalized = terminalName.trim().toLowerCase();
                        const nameTokens = normalized.split(/\s+/).filter(Boolean);
                        const matched = terminals.filter((t) => {
                            const tName = t.name.toLowerCase();
                            if (tName === normalized) return true;
                            if (tName.includes(normalized)) return true;
                            if (normalized.includes(tName)) return true;
                            return nameTokens.some((token) => tName.includes(token));
                        });

                        if (matched.length > 1) {
                            return {
                                error:
                                    'Plusieurs terminaux correspondent. Precisez le port ou le nom complet du terminal.',
                                terminals: matched.map((t) => ({
                                    id: t.id,
                                    name: t.name,
                                    portId: t.portId,
                                })),
                            };
                        }

                        const terminal = matched[0];

                        if (!terminal) {
                            return {
                                error:
                                    "Le Terminal n'a pas ete trouve. Veuillez verifier le nom du terminal et reessayer.",
                                availableTerminals: terminals.map((t) => t.name),
                            };
                        }

                        const resolveDate = (value?: string) => {
                            if (!value) return new Date();
                            const lower = value.trim().toLowerCase();
                            if (['today', 'aujourd\'hui', 'ajd'].includes(lower)) {
                                return new Date();
                            }
                            if (['tomorrow', 'demain'].includes(lower)) {
                                const d = new Date();
                                d.setDate(d.getDate() + 1);
                                return d;
                            }
                            const parsed = new Date(value);
                            return parsed;
                        };

                        const targetDate = resolveDate(date);
                        if (Number.isNaN(targetDate.getTime())) {
                            return { error: 'Invalid date format. Use YYYY-MM-DD.' };
                        }

                        const availability = await this.bookingsService.getAvailability(
                            terminal.id,
                            targetDate,
                        );

                        const toTime = (time?: string) => {
                            if (!time) return null;
                            const match = time.match(/(\d{1,2})(?:[:h](\d{1,2}))?/i);
                            if (!match) return null;
                            const h = Number(match[1]);
                            const m = match[2] ? Number(match[2]) : 0;
                            if (Number.isNaN(h) || Number.isNaN(m)) return null;
                            const d = new Date(targetDate);
                            d.setHours(h, m, 0, 0);
                            return d;
                        };

                        const start = toTime(startTime);
                        const end = toTime(endTime);

                        const slots = availability.slots.map((slot: any) => ({
                            slotStart: new Date(slot.slotStart).toISOString(),
                            slotEnd: new Date(slot.slotEnd).toISOString(),
                            bookedCount: slot.bookedCount,
                            availableCount: slot.availableCount,
                            isAvailable: slot.isAvailable,
                        }));

                        const filteredSlots =
                            start && end
                                ? slots.filter(
                                      (slot: any) =>
                                          new Date(slot.slotStart) < end &&
                                          new Date(slot.slotEnd) > start,
                                  )
                                : slots;

                        const minAvailable = filteredSlots.length
                            ? Math.min(...filteredSlots.map((s: any) => s.availableCount))
                            : 0;

                        return {
                            terminalId: terminal.id,
                            terminalName: terminal.name,
                            date: targetDate.toISOString().slice(0, 10),
                            maxCapacity: availability.maxCapacity,
                            requestedWindow:
                                start && end
                                    ? { start: start.toISOString(), end: end.toISOString() }
                                    : null,
                            minAvailableInWindow: minAvailable,
                            slots: filteredSlots,
                        };
                    } catch (e: any) {
                        return { error: e?.message ?? 'Failed to fetch availability' };
                    }
                },
            }),
        };
    }

    async listConversations(user: RequestUser | null | undefined): Promise<{ conversationId: string; title?: string | null; createdAt: Date; updatedAt: Date }[]> {
        if (!user?.id) {
            throw new UnauthorizedException();
        }

        const conversations = await this.chatConversationsRepository.find({
            where: { userId: user.id },
            order: { updatedAt: 'DESC' },
        });

        return conversations.map((conversation) => ({
            conversationId: conversation.conversationId,
            title: conversation.title ?? null,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        }));
    }

    async getConversationMessages(
        user: RequestUser | null | undefined,
        conversationId: string,
        limit: number,
        offset: number,
    ): Promise<{ id: string; role: string; content: string; createdAt: Date }[]> {
        if (!user?.id) {
            throw new UnauthorizedException();
        }

        const conversation = await this.chatConversationsRepository.findOne({
            where: { userId: user.id, conversationId },
        });

        if (!conversation) {
            throw new BadRequestException('Conversation not found');
        }

        const messages = await this.chatMessagesRepository.find({
            where: { conversationId: conversation.id },
            order: { createdAt: 'ASC' },
            take: limit,
            skip: offset,
        });

        return messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            createdAt: message.createdAt,
        }));
    }

    async confirmBooking(input: { confirmationId: string; user: RequestUser | null | undefined; conversationId?: string }): Promise<{ response: string; booking: BookingResponseDto; conversationId: string }> {
        if (!input.user?.id) {
            throw new UnauthorizedException();
        }

        const user = input.user;
        if (![UserRole.ADMIN, UserRole.CARRIER].includes(user.role as UserRole)) {
            throw new UnauthorizedException('Your role is not allowed to confirm bookings');
        }

        const pending = this.consumeBookingConfirmation(input.confirmationId, user.id);

        const booking = await this.bookingsService.create(
            pending.createDto,
            pending.carrierId,
            user.id,
        );

        const responseText = `Booking confirmed: ${booking.bookingReference}`;
        const conversation = await this.getOrCreateConversation(user.id, input.conversationId);
        await this.saveChatMessage(conversation.id, 'user', 'Confirm booking.');
        await this.saveChatMessage(conversation.id, 'assistant', responseText);
        await this.ensureConversationTitle(conversation, 'Confirm booking.');
        await this.touchConversation(conversation.id);

        return {
            response: responseText,
            booking,
            conversationId: conversation.conversationId,
        };
    }

    private formatToolResults(toolResults: any[]): string | null {
        if (!Array.isArray(toolResults) || toolResults.length === 0) {
            return null;
        }

        for (const result of toolResults) {
            const output = result?.output;
            if (!output) continue;
            if (output?.error) return output.error;

            switch (result.toolName) {
                case 'get_terminal_availability': {
                    const lines = [
                        `Disponibilite pour ${output.terminalName} le ${output.date}:`,
                        `Capacite max: ${output.maxCapacity}`,
                        `Minimum disponible sur la plage: ${output.minAvailableInWindow ?? 0}`,
                    ];
                    return lines.join('\n');
                }
                case 'get_booking_by_reference': {
                    return this.formatBookingsTable([output], 'Booking');
                }
                case 'list_bookings': {
                    if (Array.isArray(output)) {
                        return this.formatBookingsTable(output, 'Bookings');
                    }
                    break;
                }
                case 'list_users': {
                    if (Array.isArray(output)) {
                        return this.formatUsersTable(output);
                    }
                    break;
                }
                case 'get_my_profile': {
                    return this.formatProfileTable(output);
                }
                case 'list_my_trucks': {
                    if (Array.isArray(output)) {
                        return this.formatTrucksTable(output);
                    }
                    break;
                }
                case 'list_my_drivers': {
                    if (Array.isArray(output)) {
                        return this.formatDriversTable(output);
                    }
                    break;
                }
                default:
                    break;
            }
        }

        return null;
    }

    private formatAiError(error: any): string {
        const raw = String(error?.message ?? error ?? '');
        if (!raw) {
            return 'AI service is currently unavailable. Please try again later.';
        }
        if (raw.toLowerCase().includes('quota') || raw.toLowerCase().includes('rate limit')) {
            return 'AI quota exceeded. Please try again later or switch to the local model.';
        }
        return `AI service error: ${raw}`;
    }

    private formatBookingsTable(bookings: any[], title: string): string {
        if (!bookings.length) {
            return `${title}: no results.`;
        }

        const headers = ['ID', 'Reference', 'Status', 'SlotStart', 'Terminal', 'Truck', 'Driver'];
        const rows = bookings.map((b) => [
            b.id ?? 'N/A',
            b.bookingReference ?? 'N/A',
            b.status ?? 'N/A',
            b.slotStart ? this.formatDateTime(String(b.slotStart)) : 'N/A',
            b.terminal?.name ?? 'N/A',
            b.truck?.plateNumber ?? 'N/A',
            b.driver?.user?.fullName ?? 'N/A',
        ]);

        return [title, this.buildTable(headers, rows)].join('\n');
    }

    private formatUsersTable(users: any[]): string {
        if (!users.length) {
            return 'Users: no results.';
        }

        const headers = ['ID', 'Name', 'Email', 'Role', 'CreatedAt'];
        const rows = users.map((u) => [
            u.id ?? 'N/A',
            u.fullName ?? 'N/A',
            u.email ?? 'N/A',
            u.role ?? 'N/A',
            u.createdAt ? this.formatDateTime(String(u.createdAt)) : 'N/A',
        ]);

        return ['Users', this.buildTable(headers, rows)].join('\n');
    }

    private formatProfileTable(profile: any): string {
        if (!profile) {
            return 'Profile not found.';
        }

        const headers = ['Field', 'Value'];
        const rows = [
            ['ID', profile.id ?? 'N/A'],
            ['Name', profile.fullName ?? 'N/A'],
            ['Email', profile.email ?? 'N/A'],
            ['Role', profile.role ?? 'N/A'],
            ['CreatedAt', profile.createdAt ? this.formatDateTime(String(profile.createdAt)) : 'N/A'],
        ];

        return ['Profile', this.buildTable(headers, rows)].join('\n');
    }

    private formatTrucksTable(trucks: any[]): string {
        if (!trucks.length) {
            return 'Trucks: no results.';
        }

        const headers = ['ID', 'Plate', 'Status'];
        const rows = trucks.map((t) => [
            t.id ?? 'N/A',
            t.plateNumber ?? 'N/A',
            t.status ?? 'N/A',
        ]);

        return ['Trucks', this.buildTable(headers, rows)].join('\n');
    }

    private formatDriversTable(drivers: any[]): string {
        if (!drivers.length) {
            return 'Drivers: no results.';
        }

        const headers = ['ID', 'Name', 'Email', 'Status'];
        const rows = drivers.map((d) => [
            d.id ?? 'N/A',
            d.fullName ?? 'N/A',
            d.email ?? 'N/A',
            d.status ?? 'N/A',
        ]);

        return ['Drivers', this.buildTable(headers, rows)].join('\n');
    }

    private buildTable(headers: string[], rows: string[][]): string {
        const headerRow = `| ${headers.join(' | ')} |`;
        const separator = `| ${headers.map(() => '---').join(' | ')} |`;
        const body = rows.map((row) => `| ${row.map((cell) => cell || 'N/A').join(' | ')} |`);
        return [headerRow, separator, ...body].join('\n');
    }

    private getNumberEnv(key: string, fallback: number): number {
        const raw = process.env[key];
        if (!raw) return fallback;
        const value = Number(raw);
        return Number.isFinite(value) ? value : fallback;
    }

    private formatBookingConfirmation(booking: BookingConfirmationPayload['booking']): string {
        const slotStart = this.formatDateTime(booking.slotStart);
        const slotEnd = this.formatDateTime(booking.slotEnd);
        const rows = [
            ['Terminal', booking.terminalName],
            ['Slot', `${slotStart} - ${slotEnd}`],
            ['Truck', booking.truckPlate],
            ['Driver', booking.driverName],
            ['Slots', booking.slotsCount.toString()],
            ['Container', booking.containerMatricule ?? 'N/A'],
        ];

        const lines = [
            '| Field | Value |',
            '|---|---|',
            ...rows.map(([label, value]) => `| ${label} | ${value} |`),
            '',
            'Please confirm to create this booking.',
        ];

        return lines.join('\n');
    }

    private formatDateTime(value: string): string {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toISOString().replace('T', ' ').slice(0, 16);
    }

    private resolveSlotStart(slotStart?: string, date?: string, time?: string): Date | null {
        if (slotStart) {
            const parsed = new Date(slotStart);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }

        const resolvedDate = this.resolveDateToken(date);
        if (!resolvedDate) {
            return null;
        }

        if (!time) {
            if (date && /\d{1,2}:\d{2}/.test(date)) {
                const parsed = new Date(date);
                return Number.isNaN(parsed.getTime()) ? null : parsed;
            }
            return null;
        }

        const match = time.match(/(\d{1,2})(?:[:h](\d{1,2}))?/i);
        if (!match) {
            return null;
        }
        const hours = Number(match[1]);
        const minutes = match[2] ? Number(match[2]) : 0;
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            return null;
        }
        const combined = new Date(resolvedDate);
        combined.setHours(hours, minutes, 0, 0);
        return combined;
    }

    private resolveDateToken(value?: string): Date | null {
        if (!value) {
            return new Date();
        }
        const lower = value.trim().toLowerCase();
        if (['today', 'aujourd\'hui', 'ajd'].includes(lower)) {
            return new Date();
        }
        if (['tomorrow', 'demain'].includes(lower)) {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            return d;
        }
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    private createBookingConfirmation(input: {
        userId: string;
        carrierId: string;
        createDto: CreateBookingDto;
        terminalName: string;
        truckPlate: string;
        driverName: string;
        slotEnd: Date;
    }): BookingConfirmationPayload {
        this.pruneBookingConfirmations();

        const id = randomUUID();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + BOOKING_CONFIRMATION_TTL_MS);

        this.pendingBookingConfirmations.set(id, {
            id,
            userId: input.userId,
            carrierId: input.carrierId,
            createdAt: now,
            expiresAt,
            createDto: input.createDto,
            terminalName: input.terminalName,
            truckPlate: input.truckPlate,
            driverName: input.driverName,
            slotEnd: input.slotEnd,
        });

        return {
            confirmationId: id,
            expiresAt: expiresAt.toISOString(),
            booking: {
                terminalId: input.createDto.terminalId,
                terminalName: input.terminalName,
                truckId: input.createDto.truckId,
                truckPlate: input.truckPlate,
                driverId: input.createDto.driverId,
                driverName: input.driverName,
                slotStart: input.createDto.slotStart.toISOString(),
                slotEnd: input.slotEnd.toISOString(),
                slotsCount: input.createDto.slotsCount ?? 1,
                containerMatricule: input.createDto.containerMatricule ?? null,
            },
        };
    }

    private consumeBookingConfirmation(confirmationId: string, userId: string): PendingBookingConfirmation {
        this.pruneBookingConfirmations();
        const pending = this.pendingBookingConfirmations.get(confirmationId);
        if (!pending) {
            throw new BadRequestException('Confirmation not found or expired');
        }
        if (pending.userId !== userId) {
            throw new UnauthorizedException('You are not allowed to confirm this booking');
        }
        this.pendingBookingConfirmations.delete(confirmationId);
        return pending;
    }

    private pruneBookingConfirmations() {
        const now = Date.now();
        for (const [id, pending] of this.pendingBookingConfirmations.entries()) {
            if (pending.expiresAt.getTime() <= now) {
                this.pendingBookingConfirmations.delete(id);
            }
        }
    }

    private normalizeConversationId(conversationId?: string): string {
        return conversationId?.trim() || 'default';
    }

    private async getOrCreateConversation(userId: string, conversationId?: string): Promise<ChatConversation> {
        const normalized = this.normalizeConversationId(conversationId);
        let conversation = await this.chatConversationsRepository.findOne({
            where: { userId, conversationId: normalized },
        });
        if (!conversation) {
            conversation = this.chatConversationsRepository.create({
                userId,
                conversationId: normalized,
                title: null,
            });
            conversation = await this.chatConversationsRepository.save(conversation);
        }
        return conversation;
    }

    private async loadRecentMessages(conversationId: string, limit: number): Promise<ChatHistoryMessage[]> {
        const messages = await this.chatMessagesRepository.find({
            where: { conversationId },
            order: { createdAt: 'DESC' },
            take: limit,
        });

        return messages
            .reverse()
            .map((message) => ({ role: message.role, content: message.content }));
    }

    private async saveChatMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
        const message = this.chatMessagesRepository.create({
            conversationId,
            role,
            content,
        });
        await this.chatMessagesRepository.save(message);
    }

    private async ensureConversationTitle(conversation: ChatConversation, userMessage: string) {
        if (conversation.title) return;
        const trimmed = userMessage.trim();
        if (!trimmed) return;
        const title = trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed;
        await this.chatConversationsRepository.update(conversation.id, { title });
    }

    private async touchConversation(conversationId: string) {
        await this.chatConversationsRepository.update(conversationId, { updatedAt: new Date() });
    }

    private async finalizeResponse(input: {
        conversation: ChatConversation;
        userMessage: string;
        responseText: string;
        confirmation?: BookingConfirmationPayload;
    }): Promise<{ response: string; confirmation?: BookingConfirmationPayload; conversationId: string }> {
        await this.saveChatMessage(input.conversation.id, 'user', input.userMessage);
        await this.saveChatMessage(input.conversation.id, 'assistant', input.responseText);
        await this.ensureConversationTitle(input.conversation, input.userMessage);
        await this.touchConversation(input.conversation.id);
        return {
            response: input.responseText,
            confirmation: input.confirmation,
            conversationId: input.conversation.conversationId,
        };
    }
}
