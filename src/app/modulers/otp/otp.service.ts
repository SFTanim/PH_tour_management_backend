import crypto from "crypto"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"
import httpStatus from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60  // in second


const generateOtp = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
    return otp
}

const sendOTP = async (email: string, name: string) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User do not exist")
    }
    if (user.isVerified === true) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are already verified")
    }
    const otp = generateOtp()
    const redisKey = `otp:${email}`
    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })
    await sendEmail({
        to: email,
        subject: "Your OTP code",
        templateName: "otp",
        templateData: {
            name: name,
            // email: email
            otp: otp
        }
    })
};

const verifyOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User do not exist")
    }
    if (user.isVerified === true) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are already verified")
    }
    const redisKey = `otp:${email}`

    const saveOtp = await redisClient.get(redisKey)

    if (!saveOtp) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP - Not found SaveOTP")
    }
    if (saveOtp !== otp) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP - Not equal")
    }


    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ])

};

export const OTPService = {
    sendOTP,
    verifyOTP
}
