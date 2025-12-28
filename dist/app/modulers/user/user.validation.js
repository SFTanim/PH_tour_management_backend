"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" }),
    email: zod_1.default
        .string()
        .email({ message: "Invalid email address" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: zod_1.default
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, { message: "Password must contain 1 uppercase character" })
        .regex(/^(?=.*[!@#$%^&*_-])/, { message: "Password must contain 1 special character" })
        .regex(/^(?=.*\d)/, { message: "Password must contain 1 number character" }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX OF 01XXXXXXXXX" })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string()
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" })
        .optional(),
    password: zod_1.default
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, { message: "Password must contain 1 uppercase character" })
        .regex(/^(?=.*[!@#$%^&*_-])/, { message: "Password must contain 1 special character" })
        .regex(/^(?=.*\d)/, { message: "Password must contain 1 number character" })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, { message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX OF 01XXXXXXXXX" })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interface_1.Role))
        .optional(),
    IsActive: zod_1.default
        .enum(Object.values(user_interface_1.IsActive))
        .optional(),
    isDeleted: zod_1.default
        .boolean()
        .optional(),
    isVerified: zod_1.default
        .boolean()
        .optional()
});
//# sourceMappingURL=user.validation.js.map