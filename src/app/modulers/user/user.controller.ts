/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await UserServices.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully", user
//         })
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.log(error)
//         next(error)
//     }
// }



// const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const users = await UserServices.getAllUsers()
//         return users
//     } catch (error) {
//         console.log(error)
//         next()
//     }
// }

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    })
    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully", user
    // })

})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await UserServices.getAllUsers()

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "All Users Retrieved successfully",
        data: result.data,
        meta: result.meta
    })
    // res.status(httpStatus.OK).json({
    //     message: "Successfully get all user",
    //     data: users
    // })

})

export const UserController = {
    createUser,
    getAllUsers
}