import z from "zod";
export declare const createBookingZodSchema: z.ZodObject<{
    tour: z.ZodString;
    guestCount: z.ZodNumber;
}, z.core.$strip>;
export declare const updateBookingStatusZodSchema: z.ZodObject<{
    status: z.ZodEnum<{
        [x: string]: string;
    }>;
}, z.core.$strip>;
//# sourceMappingURL=booking.validation.d.ts.map