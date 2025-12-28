/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs'
import { createAccessTokenWithRefreshToken } from "../../utils/userTokens";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";

// For Login via credentials
// const credentialLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;

//     const isUserExist = await User.findOne({ email })

//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
//     }

//     const isPassMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

//     if (!isPassMatched) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password")
//     }

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject()

//     // const jwtPayload = {
//     //     userId: isUserExist._id,
//     //     email: isUserExist.email,
//     //     role: isUserExist.role,
//     // }
//     // const accessToken = jwt.sign(jwtPayload, "secret", {
//     //     expiresIn: "1d"
//     // })
//     // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
//     // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

//     const userTokens = createUserTokens(rest)

//     return {
//         // email: isUserExist.email
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     }
// }


const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}


const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not mached")
    }

    //  newHashedPassword 
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save()
}

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can not reset your password")
    }
    const isUserExist = await User.findById(decodedToken.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist")
    }
    const hashedPassword = await bcryptjs.hash(payload.newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    isUserExist.password = hashedPassword

    isUserExist.save()
}

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }

    if (user.password || user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set a password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcryptjs.hash(plainPassword, Number(envVars.BCRYPT_SALT_ROUND))

    const auths: IAuthProvider[] = [...user.auths, { provider: "credentials", providerId: user.email }]

    user.password = hashedPassword
    user.auths = auths
    await user.save()
}


const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    }
    if (!user.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    }
    if (user.isActive === IsActive.BLOCKED || user.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.isActive}`)
    }
    if (user.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`
    sendEmail({
        to: user.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: user.name,
            resetUILink
        }
    })
}


export const AuthServices = {
    getNewAccessToken,
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword,
}