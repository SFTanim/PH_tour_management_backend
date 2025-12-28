import z from "zod";
import { IsActive, Role } from "./user.interface";


export const createUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" }),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),

    password: z
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, { message: "Password must contain 1 uppercase character" })
        .regex(/^(?=.*[!@#$%^&*_-])/, { message: "Password must contain 1 special character" })
        .regex(/^(?=.*\d)/, { message: "Password must contain 1 number character" }),

    phone: z
        .string()
        .regex(
            /^(?:\+8801\d{9}|01\d{9})$/,
            { message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX OF 01XXXXXXXXX" }
        )
        .optional(),

    address: z
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
});


export const updateUserZodSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name is too short" })
        .max(50, { message: "Name is too long" })
        .optional(),

    password: z
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, { message: "Password must contain 1 uppercase character" })
        .regex(/^(?=.*[!@#$%^&*_-])/, { message: "Password must contain 1 special character" })
        .regex(/^(?=.*\d)/, { message: "Password must contain 1 number character" })
        .optional(),

    phone: z
        .string()
        .regex(
            /^(?:\+8801\d{9}|01\d{9})$/,
            { message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX OF 01XXXXXXXXX" }
        )
        .optional(),

    address: z
        .string()
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),

    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    IsActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isDeleted: z
        .boolean()
        .optional(),
    isVerified: z
        .boolean()
        .optional()
});