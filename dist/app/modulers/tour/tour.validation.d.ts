import z from "zod";
export declare const createTourZodSchema: z.ZodObject<{
    title: z.ZodString;
    desciption: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    division: z.ZodString;
    tourType: z.ZodString;
    costFrom: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    included: z.ZodOptional<z.ZodArray<z.ZodString>>;
    excluded: z.ZodOptional<z.ZodArray<z.ZodString>>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tourPlan: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxGuest: z.ZodOptional<z.ZodNumber>;
    minAge: z.ZodOptional<z.ZodNumber>;
    departureLocation: z.ZodOptional<z.ZodString>;
    arrivalLocation: z.ZodOptional<z.ZodString>;
    deleteImages: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const updateTourZodSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    costFrom: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tourType: z.ZodOptional<z.ZodString>;
    included: z.ZodOptional<z.ZodArray<z.ZodString>>;
    excluded: z.ZodOptional<z.ZodArray<z.ZodString>>;
    amenities: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tourPlan: z.ZodOptional<z.ZodArray<z.ZodString>>;
    maxGuest: z.ZodOptional<z.ZodNumber>;
    minAge: z.ZodOptional<z.ZodNumber>;
    departureLocation: z.ZodOptional<z.ZodString>;
    arrivalLocation: z.ZodOptional<z.ZodString>;
    deleteImages: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const createTourTypeZodSchema: z.ZodObject<{
    namu: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=tour.validation.d.ts.map