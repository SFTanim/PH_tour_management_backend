import { IBooking } from "./booking.interface";
export declare const BookingService: {
    createBooking: (payload: Partial<IBooking>, userId: string) => Promise<{
        booking: (import("mongoose").Document<unknown, {}, IBooking, {}, {}> & IBooking & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        paymentUrl: any;
    }>;
    getUserBookings: () => Promise<{}>;
    getBookingById: () => Promise<{}>;
    updateBookingStatus: () => Promise<{}>;
    getAllBookings: () => Promise<{}>;
};
//# sourceMappingURL=booking.service.d.ts.map