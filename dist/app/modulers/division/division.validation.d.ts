import z from "zod";
export declare const createDivisionSchema: z.ZodObject<{
    name: z.ZodString;
    thumbnail: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateDivisionSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=division.validation.d.ts.map