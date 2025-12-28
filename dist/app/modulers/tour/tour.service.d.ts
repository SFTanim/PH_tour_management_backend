import { ITour, ITourType } from "./tour.interface";
export declare const TourServices: {
    getAllTour: (query: Record<string, string>) => Promise<{
        data: (import("mongoose").Document<unknown, {}, ITour, {}, {}> & ITour & {
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
    createTour: (payload: Partial<ITour>) => Promise<import("mongoose").Document<unknown, {}, ITour, {}, {}> & ITour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTour: (id: string, payload: Partial<ITour>) => Promise<(import("mongoose").Document<unknown, {}, ITour, {}, {}> & ITour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteTour: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ITour, {}, {}> & ITour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    createTourTypes: (payload: ITourType) => Promise<import("mongoose").Document<unknown, {}, ITourType, {}, {}> & ITourType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllTourTypes: () => Promise<(import("mongoose").Document<unknown, {}, ITourType, {}, {}> & ITourType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateTourType: (id: string, payload: ITourType) => Promise<(import("mongoose").Document<unknown, {}, ITourType, {}, {}> & ITourType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteTourType: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ITourType, {}, {}> & ITourType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=tour.service.d.ts.map