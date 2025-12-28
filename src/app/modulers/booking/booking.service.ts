
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from 'http-status-codes';
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { getTransactionId } from "../../utils/getTransactionId";

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)
// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)





// Flow of creating a booking
// Virtual/Replica DB [Create booking -> Create Payment -> Update Booking ] -> Real DB
// Virtual/Replica DB [Create booking -> Create Payment (Error) -> Update Booking (Error) ] -> Delete Full Replica DB


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId()

    const session = await Booking.startSession() // Make booking collection replica
    session.startTransaction()

    try {
        const user = await User.findById(userId)

        if (!user?.phone || !user?.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Phone number and Address required")
        }

        const tour = await Tour.findById(payload.tour).select("costFrom")

        if (!tour?.costFrom) {
            throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found")
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(tour.costFrom) * Number(payload.guestCount)!

        // When you are creating something you have to pass data in an array in first parameter
        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]?._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session })

        const updateBooking = await Booking
            .findByIdAndUpdate(
                booking[0]?._id,
                { payment: payment[0]?._id },
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedUserInfo = updateBooking?.user as any
        const sslPayload: ISSLCommerz = {
            amount: amount,
            transactionId: transactionId,
            name: updatedUserInfo.name,
            email: updatedUserInfo.email,
            phone: updatedUserInfo.phone,
            address: updatedUserInfo.address
        }
        const sslPayment = await SSLService.sslPaymentInit(sslPayload) // Paying

        await session.commitTransaction() // Transaction to Real DB
        session.endSession()

        return {
            booking: updateBooking,
            paymentUrl: sslPayment.GatewayPageURL
        }

    } catch (error) {
        await session.abortTransaction() // Rollback -> End of transaction, Delete Virtual DB
        session.endSession()
        throw error // Already formatted error
    }


};


// Flow of Creating a payment for Booking a Tour
// Success: Frontend(localhost:5173) -> User -> Tour -> Book(Pending) -> Payment(Unpaid) -> SSL Commerz Consent Page -> Payment Complete -> Backend(localhost:5000) -> Update Payment(Paid) & Booking(Complete) -> Redirect to Frontend -> Frontend(localhost:5173/payment/success)
// Failed: Frontend(localhost:5173) -> User -> Tour -> Book(Pending) -> Payment(Unpaid) -> SSL Commerz Consent Page -> Payment Failed / Cancel -> Backend(localhost:5000) -> Update Payment(Failed/Cancel) & Booking(Failed/Cancel) -> Redirect to Frontend -> Frontend(localhost:5173/payment/cancelORfailed)

const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};