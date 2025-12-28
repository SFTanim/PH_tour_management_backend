"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_router_1 = require("../modulers/user/user.router");
const auth_route_1 = require("../modulers/auth/auth.route");
const tour_router_1 = require("../modulers/tour/tour.router");
const division_router_1 = require("../modulers/division/division.router");
const booking_router_1 = require("../modulers/booking/booking.router");
const payment_router_1 = require("../modulers/payment/payment.router");
const otp_router_1 = require("../modulers/otp/otp.router");
const stats_router_1 = require("../modulers/stats/stats.router");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_router_1.UserRouters
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRouters
    },
    {
        path: "/tour",
        route: tour_router_1.TourRouters
    },
    {
        path: "/division",
        route: division_router_1.DivisionRouters
    },
    {
        path: "/booking",
        route: booking_router_1.BookingRouters
    },
    {
        path: "/payment",
        route: payment_router_1.PaymentRouters
    },
    {
        path: "/otp",
        route: otp_router_1.OtpRouters
    },
    {
        path: "/stats",
        route: stats_router_1.StatsRouters
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
//# sourceMappingURL=index.js.map