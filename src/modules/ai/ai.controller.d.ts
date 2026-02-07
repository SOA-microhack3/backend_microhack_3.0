import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getAvailability(terminal: string, date: string, time?: string): Promise<any>;
    getBookingStatus(reference: string): Promise<any>;
    getCarrierHistory(carrierId: string, days?: number): Promise<any>;
    getBookingSuggestions(body: {
        carrierId: string;
        truckCount: number;
        preferredTerminal: string;
        preferredDate: string;
    }): Promise<any>;
}
