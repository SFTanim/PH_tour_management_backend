"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_config_1 = require("../../config/redis.config");
const sendEmail_1 = require("../../utils/sendEmail");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_model_1 = require("../user/user.model");
const OTP_EXPIRATION = 2 * 60; // in second
const generateOtp = (length = 6) => {
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
const sendOTP = async (email, name) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User do not exist");
    }
    if (user.isVerified === true) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are already verified");
    }
    const otp = generateOtp();
    const redisKey = `otp:${email}`;
    await redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });
    await (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP code",
        templateName: "otp",
        templateData: {
            name: name,
            // email: email
            otp: otp
        }
    });
};
const verifyOTP = async (email, otp) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User do not exist");
    }
    if (user.isVerified === true) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are already verified");
    }
    const redisKey = `otp:${email}`;
    const saveOtp = await redis_config_1.redisClient.get(redisKey);
    if (!saveOtp) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid OTP - Not found SaveOTP");
    }
    if (saveOtp !== otp) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid OTP - Not equal");
    }
    await Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redis_config_1.redisClient.del([redisKey])
    ]);
};
exports.OTPService = {
    sendOTP,
    verifyOTP
};
//# sourceMappingURL=otp.service.js.map