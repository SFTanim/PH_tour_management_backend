


// const initPayment = async (bookingId: string) => {

import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";
import { generatePDF, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from 'http-status-codes';

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


const initPayment = async (bookingId: string) => {
    const payment = await Payment.findOne({ booking: bookingId })
    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found, You have not book this tour")
    }

    const booking = await Booking.findById(payment.booking)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedUserInfo = booking?.user as any
    const sslPayload: ISSLCommerz = {
        amount: payment.amount,
        transactionId: payment.transactionId,
        name: updatedUserInfo.name,
        email: updatedUserInfo.email,
        phone: updatedUserInfo.phone,
        address: updatedUserInfo.address
    }
    const sslPayment = await SSLService.sslPaymentInit(sslPayload) // Paying

    return {
        booking: booking,
        paymentUrl: sslPayment.GatewayPageURL
    }
};

const successPayment = async (query: Record<string, string>) => {
    // Update Booking Status = Confirm
    // Update Payment Status = Paid

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const updatedPayment = await Payment
            .findOneAndUpdate(
                { transactionId: query.transactionId },
                { status: PAYMENT_STATUS.PAID },
                { runValidators: true, session }
            )

        // Updated Booking
        const updatedBooking = await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true }
            )
            .populate("tour", "title")
            .populate("user", "name email")
            .populate("payment", "amount transactionId")

        if (!updatedBooking) {
            throw new AppError(401, `Updating Booking Error`)
        }

        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking.createdAt as Date,
            guestCount: updatedBooking.guestCount,
            totalAmount: (updatedBooking.payment as unknown as IPayment).amount,
            tourTitle: (updatedBooking.tour as unknown as ITour).title,
            transactionId: (updatedBooking.payment as unknown as IPayment).transactionId,
            userName: (updatedBooking.user as unknown as IUser).name
        }

        const pdfBuffer = await generatePDF(invoiceData)
        const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")
        if (!cloudinaryResult) {
            throw new AppError(401, `Failed Uploading file in Cloudinary`)
        }

        await Payment.findByIdAndUpdate(updatedPayment?._id, { invoiceUrl: cloudinaryResult?.secure_url }, { runValidators: true, session })

        await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
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
        })

        await session.commitTransaction()

        session.endSession()

        return { success: true, message: "Payment completed Successfully" }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, error.message)
        await session.abortTransaction()
        session.endSession()
    }

};

const failPayment = async (query: Record<string, string>) => {
    // Update Booking Status = Fail
    // Update Payment Status = Fail
    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const updatedPayment = await Payment
            .findOneAndUpdate(
                { transactionId: query.transactionId },
                { status: PAYMENT_STATUS.FAIL },
                { runValidators: true, session }
            )

        // Updated Booking
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAIL },
                { runValidators: true }
            )

        await session.commitTransaction()
        session.endSession()

        return { success: false, message: "Payment Failed" }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, error.message)
        await session.abortTransaction()
        session.endSession()
    }

};

const cancelPayment = async (query: Record<string, string>) => {
    // Update Booking Status = CANCEL
    // Update Payment Status = CANCEL

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const updatedPayment = await Payment
            .findOneAndUpdate(
                { transactionId: query.transactionId },
                { status: PAYMENT_STATUS.CANCEL },
                { runValidators: true, session }
            )

        // Updated Booking
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true }
            )

        await session.commitTransaction()
        session.endSession()

        return { success: false, message: "Payment Cancelled" }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, error.message)
        await session.abortTransaction()
        session.endSession()
    }

};

const getInvoiceDownloadUrl = async (paymentId: string) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl")

    if (!payment) {
        throw new AppError(401, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    }

    return payment.invoiceUrl
};

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl,
};
