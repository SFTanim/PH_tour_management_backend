import { Router } from "express";
import { UserRouters } from "../modulers/user/user.router";
import { AuthRouters } from "../modulers/auth/auth.route";
import { TourRouters } from "../modulers/tour/tour.router";
import { DivisionRouters } from "../modulers/division/division.router";
import { BookingRouters } from "../modulers/booking/booking.router";
import { PaymentRouters } from "../modulers/payment/payment.router";
import { OtpRouters } from "../modulers/otp/otp.router";
import { StatsRouters } from "../modulers/stats/stats.router";

export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRouters
    },
    {
        path: '/auth',
        route: AuthRouters
    },
    {
        path: "/tour",
        route: TourRouters
    },
    {
        path: "/division",
        route: DivisionRouters
    }
    ,
    {
        path: "/booking",
        route: BookingRouters
    },
    {
        path: "/payment",
        route: PaymentRouters
    },
    {
        path: "/otp",
        route: OtpRouters
    },
    {
        path: "/stats",
        route: StatsRouters
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})