import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";


// Partial<IUser> means some property of IUser not all
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }
    const user = await User.create(
        {
            email,
            password: hashedPassword,
            auths: [authProvider],
            ...rest
        }
    )
    return user
}

const getMe = async (userId: string) => {
    const myProfile = await User.findById(userId).select("-password")

    return {
        data: myProfile
    }
}

const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};

const getAllUsers = async () => {
    const users = await User.find({})
    const totalUser = await User.countDocuments()
    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}

const updateUserInfo = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    /**
     * email - can not update
     * name, password, , phone, address can update
     * role, isdelete, ... - only admin and super admin can update
     * */

    if (decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER) {
        if (!userId == decodedToken.userId) {
            throw new AppError(401, `You are not authorized`)
        }
    }


    const ifUserExist = await User.findById(userId)

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }


    if (decodedToken.role === Role.ADMIN && ifUserExist.role === Role.SUPER_ADMIN) {
        if (!userId == decodedToken.userId) {
            throw new AppError(401, `You are not authorized`)
        }
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
        // if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
        //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        // }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    // if (payload.password) {
    //     payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    // }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })
    if (payload.picture && ifUserExist.picture) {
        await deleteImageFromCloudinary(ifUserExist.picture)
    }
    return newUpdatedUser
}


export const UserServices = {
    createUser,
    getMe,
    getSingleUser,
    getAllUsers,
    updateUserInfo
}