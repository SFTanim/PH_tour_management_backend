export declare const PaymentService: {
    successPayment: (query: Record<string, string>) => Promise<{
        success: boolean;
        message: string;
    }>;
    failPayment: (query: Record<string, string>) => Promise<{
        success: boolean;
        message: string;
    }>;
    cancelPayment: (query: Record<string, string>) => Promise<{
        success: boolean;
        message: string;
    }>;
    initPayment: (bookingId: string) => Promise<{
        booking: (import("mongoose").Document<unknown, {}, import("../booking/booking.interface").IBooking, {}, {}> & import("../booking/booking.interface").IBooking & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        paymentUrl: any;
    }>;
    getInvoiceDownloadUrl: (paymentId: string) => Promise<string>;
};
//# sourceMappingURL=payment.service.d.ts.map