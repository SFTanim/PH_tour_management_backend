import { Types } from "mongoose";
export declare enum BOOKING_STATUS {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    FAIL = "FAIL"
}
export interface IBooking {
    user: Types.ObjectId;
    tour: Types.ObjectId;
    payment?: Types.ObjectId;
    guestCount: number;
    status: BOOKING_STATUS;
    createdAt?: Date;
}
//# sourceMappingURL=booking.interface.d.ts.map