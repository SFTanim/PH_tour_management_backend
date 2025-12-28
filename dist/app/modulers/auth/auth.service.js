"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userTokens_1 = require("../../utils/userTokens");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const user_interface_1 = require("../user/user.interface");
const sendEmail_1 = require("../../utils/sendEmail");
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
const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await (0, userTokens_1.createAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken: newAccessToken
    };
};
const changePassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old password does not mached");
    }
    //  newHashedPassword 
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.save();
};
const resetPassword = async (payload, decodedToken) => {
    if (payload.id != decodedToken.userId) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can not reset your password");
    }
    const isUserExist = await user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User doesn't exist");
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    isUserExist.password = hashedPassword;
    isUserExist.save();
};
const setPassword = async (userId, plainPassword) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    if (user.password || user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already set a password. Now you can change the password from your profile password update");
    }
    const hashedPassword = await bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const auths = [...user.auths, { provider: "credentials", providerId: user.email }];
    user.password = hashedPassword;
    user.auths = auths;
    await user.save();
};
const forgotPassword = async (email) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    if (!user.isVerified) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    if (user.isActive === user_interface_1.IsActive.BLOCKED || user.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${user.isActive}`);
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, { expiresIn: "10m" });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${user._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: user.name,
            resetUILink
        }
    });
};
exports.AuthServices = {
    getNewAccessToken,
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword,
};
//# sourceMappingURL=auth.service.js.map