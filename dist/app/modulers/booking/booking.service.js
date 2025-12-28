"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interface_1 = require("../payment/payment.interface");
const tour_model_1 = require("../tour/tour.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const getTransactionId_1 = require("../../utils/getTransactionId");
// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)
// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)
// Flow of creating a booking
// Virtual/Replica DB [Create booking -> Create Payment -> Update Booking ] -> Real DB
// Virtual/Replica DB [Create booking -> Create Payment (Error) -> Update Booking (Error) ] -> Delete Full Replica DB
const createBooking = async (payload, userId) => {
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    const session = await booking_model_1.Booking.startSession(); // Make booking collection replica
    session.startTransaction();
    try {
        const user = await user_model_1.User.findById(userId);
        if (!user?.phone || !user?.address) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Phone number and Address required");
        }
        const tour = await tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!tour?.costFrom) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "No tour cost found");
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(tour.costFrom) * Number(payload.guestCount);
        // When you are creating something you have to pass data in an array in first parameter
        const booking = await booking_model_1.Booking.create([{
                user: userId,
                status: booking_interface_1.BOOKING_STATUS.PENDING,
                ...payload
            }], { session });
        const payment = await payment_model_1.Payment.create([{
                booking: booking[0]?._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: amount
            }], { session });
        const updateBooking = await booking_model_1.Booking
            .findByIdAndUpdate(booking[0]?._id, { payment: payment[0]?._id }, { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedUserInfo = updateBooking?.user;
        const sslPayload = {
            amount: amount,
            transactionId: transactionId,
            name: updatedUserInfo.name,
            email: updatedUserInfo.email,
            phone: updatedUserInfo.phone,
            address: updatedUserInfo.address
        };
        const sslPayment = await sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload); // Paying
        await session.commitTransaction(); // Transaction to Real DB
        session.endSession();
        return {
            booking: updateBooking,
            paymentUrl: sslPayment.GatewayPageURL
        };
    }
    catch (error) {
        await session.abortTransaction(); // Rollback -> End of transaction, Delete Virtual DB
        session.endSession();
        throw error; // Already formatted error
    }
};
// Flow of Creating a payment for Booking a Tour
// Success: Frontend(localhost:5173) -> User -> Tour -> Book(Pending) -> Payment(Unpaid) -> SSL Commerz Consent Page -> Payment Complete -> Backend(localhost:5000) -> Update Payment(Paid) & Booking(Complete) -> Redirect to Frontend -> Frontend(localhost:5173/payment/success)
// Failed: Frontend(localhost:5173) -> User -> Tour -> Book(Pending) -> Payment(Unpaid) -> SSL Commerz Consent Page -> Payment Failed / Cancel -> Backend(localhost:5000) -> Update Payment(Failed/Cancel) & Booking(Failed/Cancel) -> Redirect to Frontend -> Frontend(localhost:5173/payment/cancelORfailed)
const getUserBookings = async () => {
    return {};
};
const getBookingById = async () => {
    return {};
};
const updateBookingStatus = async () => {
    return {};
};
const getAllBookings = async () => {
    return {};
};
exports.BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};
//# sourceMappingURL=booking.service.js.map