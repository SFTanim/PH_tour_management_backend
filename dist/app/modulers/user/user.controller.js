"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
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
const createUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const payload = {
        ...req.body,
        picture: req.file?.path
    };
    const user = await user_service_1.UserServices.createUser(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    });
    // res.status(httpStatus.CREATED).json({
    //     message: "User created successfully", user
    // })
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const result = await user_service_1.UserServices.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.ACCEPTED,
        success: true,
        message: "Your profile retrived successfully",
        data: result.data
    });
});
const getSingleUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const id = req.params.id;
    const result = await user_service_1.UserServices.getSingleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const userId = req.params.id;
    const payload = {
        ...req.body,
        picture: req.file?.path
    };
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const user = await user_service_1.UserServices.updateUserInfo(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User updated successfully",
        data: user
    });
});
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = await user_service_1.UserServices.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "All Users Retrieved successfully",
        data: result.data,
        meta: result.meta
    });
    // res.status(httpStatus.OK).json({
    //     message: "Successfully get all user",
    //     data: users
    // })
});
exports.UserController = {
    createUser,
    getMe,
    getSingleUser,
    getAllUsers,
    updateUser
};
//# sourceMappingURL=user.controller.js.map