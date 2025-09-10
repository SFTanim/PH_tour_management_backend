import { Router } from "express";
import { UserRouters } from "../modulers/user/user.router";

export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRouters
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})