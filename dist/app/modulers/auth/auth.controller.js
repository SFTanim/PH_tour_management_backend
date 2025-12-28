"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_service_1 = require("./auth.service");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const setCookies_1 = require("../../utils/setCookies");
const userTokens_1 = require("../../utils/userTokens");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
// Login via credentials
// const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const loginInfo = await AuthServices.credentialLogin(req.body)
//     // res.cookie("refreshToken", loginInfo.refreshToken, {
//     //     // You must put this httpOnly property
//     //     httpOnly: true,
//     //     secure: false
//     // })
//     // res.cookie("accessToken", loginInfo.accessToken, {
//     //     // You must put this httpOnly property
//     //     httpOnly: true,
//     //     secure: false
//     // })
//     setAuthCookies(res, loginInfo)
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "User logged in successfully",
//         data: loginInfo
//     })
// })
// Login via Passport
const credentialLogin = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    passport_1.default.authenticate("local", async (err, user, info) => {
        if (err) {
            return next(new appError_1.default(401, err));
        }
        if (!user) {
            return next(new appError_1.default(401, info.message));
        }
        const userTokens = (0, userTokens_1.createUserTokens)(user);
        // delete user.toObject().password
        const { password: pass, ...rest } = user.toObject();
        (0, setCookies_1.setAuthCookies)(res, userTokens);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        });
    })(req, res, next);
});
const getNewAccessToken = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Refresh token does not found in cookies");
    }
    const tokenInfo = await auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //     // You must put this httpOnly property
    //     httpOnly: true,
    //     secure: false
    // })
    (0, setCookies_1.setAuthCookies)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "New Access Token generated successfully",
        data: tokenInfo
    });
});
const userLogout = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User logged out successfully",
        data: undefined
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    await auth_service_1.AuthServices.changePassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Password changed successfully",
        data: undefined
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    await auth_service_1.AuthServices.resetPassword(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Password changed successfully",
        data: undefined
    });
});
const setPassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const { password } = req.body;
    await auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Password changed successfully",
        data: undefined
    });
});
const forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { email } = req.body;
    await auth_service_1.AuthServices.forgotPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Email Send successfully",
        data: null
    });
});
const googleCallbackController = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    console.log("User from google auth", user);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const tokenInfo = (0, userTokens_1.createUserTokens)(user);
    (0, setCookies_1.setAuthCookies)(res, tokenInfo);
    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: "Password changed successfully",
    //     data: undefined
    // })
    // res.redirect(envVars.FRONTEND_URL)
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
});
exports.AuthController = {
    credentialLogin,
    getNewAccessToken,
    userLogout,
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword,
    googleCallbackController,
};
//# sourceMappingURL=auth.controller.js.map