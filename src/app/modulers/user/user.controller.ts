/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";



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
    const payload: IUser = {
        ...req.body,
        picture: req.file?.path
    }
    const user = await UserServices.createUser(payload)

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


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId)

    sendResponse(res, {
        statusCode: httpStatus.ACCEPTED,
        success: true,
        message: "Your profile retrived successfully",
        data: result.data
    })

})

const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const payload: IUser = {
        ...req.body,
        picture: req.file?.path
    }
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user

    const user = await UserServices.updateUserInfo(userId as string, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User updated successfully",
        data: user
    })
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
    getMe,
    getSingleUser,
    getAllUsers,
    updateUser
}