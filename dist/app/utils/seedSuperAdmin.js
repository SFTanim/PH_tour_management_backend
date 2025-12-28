"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
/* eslint-disable no-console */
const env_1 = require("../config/env");
const user_interface_1 = require("../modulers/user/user.interface");
const user_model_1 = require("../modulers/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await user_model_1.User.findOne({ email: env_1.envVars.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super Admin Exist");
            return;
        }
        console.log("Trying to Create Super Admin");
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL
        };
        const hashedPassword = await bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const payload = {
            name: "Super Admin",
            role: user_interface_1.Role.SUPER_ADMIN,
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        };
        const superAdmin = await user_model_1.User.create(payload);
        console.log("Super Admin Created Successfully. \n");
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
};
exports.seedSuperAdmin = seedSuperAdmin;
//# sourceMappingURL=seedSuperAdmin.js.map