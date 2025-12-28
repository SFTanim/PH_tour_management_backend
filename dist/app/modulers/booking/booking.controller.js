"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const booking_service_1 = require("./booking.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodeToken = req.user;
    const booking = await booking_service_1.BookingService.createBooking(req.body, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
});
const getUserBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const bookings = await booking_service_1.BookingService.getUserBookings();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings,
    });
});
const getSingleBooking = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const booking = await booking_service_1.BookingService.getBookingById();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrieved successfully",
        data: booking,
    });
});
const getAllBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bookings = await booking_service_1.BookingService.getAllBookings();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: {},
        // meta: {},
    });
});
const updateBookingStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const updated = await booking_service_1.BookingService.updateBookingStatus();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Booking Status Updated Successfully",
        data: updated,
    });
});
exports.BookingController = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus
};
//# sourceMappingURL=booking.controller.js.map