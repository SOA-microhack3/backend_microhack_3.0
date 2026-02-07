"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentService = void 0;
const common_1 = require("@nestjs/common");
const ai_1 = require("ai");
const google_1 = require("@ai-sdk/google");
const zod_1 = require("zod");
const enums_1 = require("../../common/enums");
@(0, common_1.Injectable)()
class AiAgentService {
    usersService;
    bookingsService;
    carriersService;
    operatorsService;
    terminalsService;
    constructor(usersService, bookingsService, carriersService, operatorsService, terminalsService) {
        this.usersService = usersService;
        this.bookingsService = bookingsService;
        this.carriersService = carriersService;
        this.operatorsService = operatorsService;
        this.terminalsService = terminalsService;
    }
    async chat(input) {
        if (!input.user?.id) {
            throw new common_1.UnauthorizedException();
        }
        const tools = this.buildTools(input.user);
        const system = this.buildSystemPrompt();
        const result = await (0, ai_1.generateText)({
            model: (0, google_1.google)(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'),
            system,
            prompt: input.message,
            tools,
            stopWhen: (0, ai_1.stepCountIs)(8),
        });
        const text = result.text?.trim();
        if (text) {
            return text;
        }
        const availabilityResult = result.toolResults.find((res) => res.toolName === 'get_terminal_availability');
        if (availabilityResult?.output) {
            const output = availabilityResult.output;
            if (output?.error) {
                return output.error;
            }
            const lines = [
                `Disponibilite pour ${output.terminalName} le ${output.date}:`,
                `Capacite max: ${output.maxCapacity}`,
                `Minimum disponible sur la plage: ${output.minAvailableInWindow ?? 0}`,
            ];
            return lines.join('\n');
        }
        return 'Aucune reponse.';
    }
    buildSystemPrompt() {
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
            'Response style:',
            '- Keep responses concise and actionable.',
            '- When listing items, present a compact table.',
            'When displaying bookings or users, ALWAYS use Markdown tables.',
            'Include key columns like ID, Reference, Status, and Date.',
        ].join('\n');
    }
    buildTools(user) {
        const requireAdmin = () => {
            if (user.role !== enums_1.UserRole.ADMIN) {
                throw new common_1.UnauthorizedException('Admin privileges required');
            }
        };
        const getCarrierIdForUser = async () => {
            const carrier = await this.carriersService.findByUserId(user.id);
            if (!carrier) {
                throw new common_1.UnauthorizedException('No carrier profile is associated with your account');
            }
            return carrier.id;
        };
        const getTerminalIdForUser = async () => {
            const operator = await this.operatorsService.findByUserId(user.id);
            if (!operator) {
                throw new common_1.UnauthorizedException('No operator profile is associated with your account');
            }
            return operator.terminalId;
        };
        return {
            get_my_profile: (0, ai_1.tool)({
                description: 'Get the current authenticated user profile.',
                inputSchema: zod_1.z.object({}),
                outputSchema: zod_1.z.any(),
                execute: async () => {
                    try {
                        return await this.usersService.findOne(user.id);
                    }
                    catch (e) {
                        return { error: e?.message ?? 'Failed to fetch profile' };
                    }
                },
            }),
            list_users: (0, ai_1.tool)({
                description: 'List all users. Admin only. Optional filter by role.',
                inputSchema: zod_1.z.object({
                    role: zod_1.z.nativeEnum(enums_1.UserRole).optional(),
                }),
                outputSchema: zod_1.z.any(),
                execute: async ({ role }) => {
                    try {
                        requireAdmin();
                        return await this.usersService.findAll(role);
                    }
                    catch (e) {
                        return { error: e?.message ?? 'Failed to list users' };
                    }
                },
            }),
            get_booking_by_reference: (0, ai_1.tool)({
                description: 'Get booking details by booking reference (e.g., BK-ABC123).',
                inputSchema: zod_1.z.object({
                    reference: zod_1.z.string().min(1),
                }),
                outputSchema: zod_1.z.any(),
                execute: async ({ reference }) => {
                    try {
                        const booking = await this.bookingsService.findByReference(reference);
                        if (user.role === enums_1.UserRole.ADMIN) {
                            return booking;
                        }
                        if (user.role === enums_1.UserRole.CARRIER) {
                            const carrierId = await getCarrierIdForUser();
                            if (booking.carrierId && booking.carrierId !== carrierId) {
                                throw new common_1.UnauthorizedException('You are not allowed to access this booking');
                            }
                            return booking;
                        }
                        if (user.role === enums_1.UserRole.OPERATOR) {
                            const terminalId = await getTerminalIdForUser();
                            if (booking.terminalId && booking.terminalId !== terminalId) {
                                throw new common_1.UnauthorizedException('You are not allowed to access this booking');
                            }
                            return booking;
                        }
                        throw new common_1.UnauthorizedException('You are not allowed to access booking details');
                    }
                    catch (e) {
                        return { error: e?.message ?? 'Failed to fetch booking' };
                    }
                },
            }),
            list_bookings: (0, ai_1.tool)({
                description: 'List bookings visible to the current user. Carriers/operators are automatically scoped to their carrier/terminal.',
                inputSchema: zod_1.z.object({
                    status: zod_1.z.nativeEnum(enums_1.BookingStatus).optional(),
                }),
                outputSchema: zod_1.z.any(),
                execute: async ({ status }) => {
                    try {
                        if (user.role === enums_1.UserRole.ADMIN) {
                            return await this.bookingsService.findAll(user.id, enums_1.UserRole.ADMIN, undefined, undefined, status);
                        }
                        if (user.role === enums_1.UserRole.CARRIER) {
                            const carrierId = await getCarrierIdForUser();
                            return await this.bookingsService.findAll(user.id, enums_1.UserRole.CARRIER, carrierId, undefined, status);
                        }
                        if (user.role === enums_1.UserRole.OPERATOR) {
                            const terminalId = await getTerminalIdForUser();
                            return await this.bookingsService.findAll(user.id, enums_1.UserRole.OPERATOR, undefined, terminalId, status);
                        }
                        throw new common_1.UnauthorizedException('Your role is not allowed to list bookings');
                    }
                    catch (e) {
                        return { error: e?.message ?? 'Failed to list bookings' };
                    }
                },
            }),
            get_terminal_availability: (0, ai_1.tool)({
                description: 'Check slot availability for a terminal on a date. Optionally filter by time range (HH:MM).',
                inputSchema: zod_1.z.object({
                    terminalName: zod_1.z.string().min(1),
                    date: zod_1.z.string().optional(),
                    startTime: zod_1.z.string().optional(),
                    endTime: zod_1.z.string().optional(),
                }),
                outputSchema: zod_1.z.any(),
                execute: async ({ terminalName, date, startTime, endTime }) => {
                    try {
                        const terminals = await this.terminalsService.findAll();
                        const normalized = terminalName.trim().toLowerCase();
                        const nameTokens = normalized.split(/\s+/).filter(Boolean);
                        const matched = terminals.filter((t) => {
                            const tName = t.name.toLowerCase();
                            if (tName === normalized)
                                return true;
                            if (tName.includes(normalized))
                                return true;
                            if (normalized.includes(tName))
                                return true;
                            return nameTokens.some((token) => tName.includes(token));
                        });
                        if (matched.length > 1) {
                            return {
                                error: 'Plusieurs terminaux correspondent. Precisez le port ou le nom complet du terminal.',
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
                                error: "Le Terminal n'a pas ete trouve. Veuillez verifier le nom du terminal et reessayer.",
                                availableTerminals: terminals.map((t) => t.name),
                            };
                        }
                        const resolveDate = (value) => {
                            if (!value)
                                return new Date();
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
                        const availability = await this.bookingsService.getAvailability(terminal.id, targetDate);
                        const toTime = (time) => {
                            if (!time)
                                return null;
                            const match = time.match(/(\d{1,2})(?:[:h](\d{1,2}))?/i);
                            if (!match)
                                return null;
                            const h = Number(match[1]);
                            const m = match[2] ? Number(match[2]) : 0;
                            if (Number.isNaN(h) || Number.isNaN(m))
                                return null;
                            const d = new Date(targetDate);
                            d.setHours(h, m, 0, 0);
                            return d;
                        };
                        const start = toTime(startTime);
                        const end = toTime(endTime);
                        const slots = availability.slots.map((slot) => ({
                            slotStart: new Date(slot.slotStart).toISOString(),
                            slotEnd: new Date(slot.slotEnd).toISOString(),
                            bookedCount: slot.bookedCount,
                            availableCount: slot.availableCount,
                            isAvailable: slot.isAvailable,
                        }));
                        const filteredSlots = start && end
                            ? slots.filter((slot) => new Date(slot.slotStart) < end &&
                                new Date(slot.slotEnd) > start)
                            : slots;
                        const minAvailable = filteredSlots.length
                            ? Math.min(...filteredSlots.map((s) => s.availableCount))
                            : 0;
                        return {
                            terminalId: terminal.id,
                            terminalName: terminal.name,
                            date: targetDate.toISOString().slice(0, 10),
                            maxCapacity: availability.maxCapacity,
                            requestedWindow: start && end
                                ? { start: start.toISOString(), end: end.toISOString() }
                                : null,
                            minAvailableInWindow: minAvailable,
                            slots: filteredSlots,
                        };
                    }
                    catch (e) {
                        return { error: e?.message ?? 'Failed to fetch availability' };
                    }
                },
            }),
        };
    }
}
exports.AiAgentService = AiAgentService;
