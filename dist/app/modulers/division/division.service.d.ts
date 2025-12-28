import { IDivision } from "./division.interface";
export declare const DivisionServices: {
    createDivision: (payload: IDivision) => Promise<import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllDivision: (query: Record<string, string>) => Promise<{
        data: (import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
    }>;
    getSingleDivision: (slug: string) => Promise<{
        data: (import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    updateDivision: (id: string, payload: Partial<IDivision>) => Promise<(import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteDivision: (id: string) => Promise<null>;
};
//# sourceMappingURL=division.service.d.ts.map