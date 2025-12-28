"use strict";
// const initPayment = async (bookingId: string) => {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
//     const payment = await Payment.findOne({ booking: bookingId })
//     if (!payment) {
//         throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
//     }
//     const booking = await Booking.findById(payment.booking)
//     const userAddress = (booking?.user as any).address
//     const userEmail = (booking?.user as any).email
//     const userPhoneNumber = (booking?.user as any).phone
//     const userName = (booking?.user as any).name
//     const sslPayload: ISSLCommerz = {
//         address: userAddress,
//         email: userEmail,
//         phoneNumber: userPhoneNumber,
//         name: userName,
//         amount: payment.amount,
//         transactionId: payment.transactionId
//     }
//     const sslPayment = await SSLService.sslPaymentInit(sslPayload)
//     return {
//         paymentUrl: sslPayment.GatewayPageURL
//     }
// };
const initPayment = async (bookingId) => {
    const payment = await payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found, You have not book this tour");
    }
    const booking = await booking_model_1.Booking.findById(payment.booking);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedUserInfo = booking?.user;
    const sslPayload = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: updatedUserInfo.name,
        email: updatedUserInfo.email,
        phone: updatedUserInfo.phone,
        address: updatedUserInfo.address
    };
    const sslPayment = await sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload); // Paying
    return {
        booking: booking,
        paymentUrl: sslPayment.GatewayPageURL
    };
};
const successPayment = async (query) => {
    // Update Booking Status = Confirm
    // Update Payment Status = Paid
    const session = await booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await payment_model_1.Payment
            .findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { runValidators: true, session });
        // Updated Booking
        const updatedBooking = await booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment?.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { new: true, runValidators: true })
            .populate("tour", "title")
            .populate("user", "name email")
            .populate("payment", "amount transactionId");
        if (!updatedBooking) {
            throw new appError_1.default(401, `Updating Booking Error`);
        }
        const invoiceData = {
            bookingDate: updatedBooking.createdAt,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedBooking.payment.amount,
            tourTitle: updatedBooking.tour.title,
            transactionId: updatedBooking.payment.transactionId,
            userName: updatedBooking.user.name
        };
        const pdfBuffer = await (0, invoice_1.generatePDF)(invoiceData);
        const cloudinaryResult = await (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        if (!cloudinaryResult) {
            throw new appError_1.default(401, `Failed Uploading file in Cloudinary`);
        }
        await payment_model_1.Payment.findByIdAndUpdate(updatedPayment?._id, { invoiceUrl: cloudinaryResult?.secure_url }, { runValidators: true, session });
        await (0, sendEmail_1.sendEmail)({
            to: updatedBooking.user.email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            // templateData: "",
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });
        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment completed Successfully" };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
        await session.abortTransaction();
        session.endSession();
    }
};
const failPayment = async (query) => {
    // Update Booking Status = Fail
    // Update Payment Status = Fail
    const session = await booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await payment_model_1.Payment
            .findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAIL }, { runValidators: true, session });
        // Updated Booking
        await booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment?.booking, { status: booking_interface_1.BOOKING_STATUS.FAIL }, { runValidators: true });
        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Failed" };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
        await session.abortTransaction();
        session.endSession();
    }
};
const cancelPayment = async (query) => {
    // Update Booking Status = CANCEL
    // Update Payment Status = CANCEL
    const session = await booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = await payment_model_1.Payment
            .findOneAndUpdate({ transactionId: query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCEL }, { runValidators: true, session });
        // Updated Booking
        await booking_model_1.Booking
            .findByIdAndUpdate(updatedPayment?.booking, { status: booking_interface_1.BOOKING_STATUS.CANCEL }, { runValidators: true });
        await session.commitTransaction();
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
        await session.abortTransaction();
        session.endSession();
    }
};
const getInvoiceDownloadUrl = async (paymentId) => {
    const payment = await payment_model_1.Payment.findById(paymentId)
        .select("invoiceUrl");
    if (!payment) {
        throw new appError_1.default(401, "Payment not found");
    }
    if (!payment.invoiceUrl) {
        throw new appError_1.default(401, "No invoice found");
    }
    return payment.invoiceUrl;
};
exports.PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl,
};
//# sourceMappingURL=payment.service.js.map