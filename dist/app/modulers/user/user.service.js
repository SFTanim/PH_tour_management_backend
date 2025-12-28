"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const cloudinary_config_1 = require("../../config/cloudinary.config");
// Partial<IUser> means some property of IUser not all
const createUser = async (payload) => {
    const { email, password, ...rest } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = { provider: "credentials", providerId: email };
    const user = await user_model_1.User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });
    return user;
};
const getMe = async (userId) => {
    const myProfile = await user_model_1.User.findById(userId).select("-password");
    return {
        data: myProfile
    };
};
const getSingleUser = async (id) => {
    const user = await user_model_1.User.findById(id).select("-password");
    return {
        data: user
    };
};
const getAllUsers = async () => {
    const users = await user_model_1.User.find({});
    const totalUser = await user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUser
        }
    };
};
const updateUserInfo = async (userId, payload, decodedToken) => {
    /**
     * email - can not update
     * name, password, , phone, address can update
     * role, isdelete, ... - only admin and super admin can update
     * */
    if (decodedToken.role === user_interface_1.Role.GUIDE || decodedToken.role === user_interface_1.Role.USER) {
        if (!userId == decodedToken.userId) {
            throw new appError_1.default(401, `You are not authorized`);
        }
    }
    const ifUserExist = await user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (decodedToken.role === user_interface_1.Role.ADMIN && ifUserExist.role === user_interface_1.Role.SUPER_ADMIN) {
        if (!userId == decodedToken.userId) {
            throw new appError_1.default(401, `You are not authorized`);
        }
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        // if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
        //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        // }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.GUIDE) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // if (payload.password) {
    //     payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    // }
    const newUpdatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    if (payload.picture && ifUserExist.picture) {
        await (0, cloudinary_config_1.deleteImageFromCloudinary)(ifUserExist.picture);
    }
    return newUpdatedUser;
};
exports.UserServices = {
    createUser,
    getMe,
    getSingleUser,
    getAllUsers,
    updateUserInfo
};
//# sourceMappingURL=user.service.js.map