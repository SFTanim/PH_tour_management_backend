"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_constant_1 = require("./tour.constant");
const tour_model_1 = require("./tour.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Tour
// const getAllTour = async (query: Record<string, string>) => {
//     // Filter is for finding exactly mached data
//     // Searching if for finding partially mached data
//     const filter = query
//     const searchTerm = query.searchTerm || ""
//     const sort = query.sort || "-createdAt" // sort example = Ascending-> location or Deascending-> -location
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 10
//     const skip = (page - 1) * limit
//     // Field Filtering
//     const fields = query.fields?.split(",").join(" ") || "" // example: for showing only title -> "title" or for showing everything except title -> "-title"
//     // delete filter["searchTerm"] // to delete seachTerm name but valueof searchTerm wont delete
//     // delete filter["sort"] // to delete sort name but valueof sort wont delete
//     for (const field in excludeField) {
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete filter[field]
//     }
//     //  const tours = await Tour.find({
//     //     // title: { $regex: searchTerm, $options: "i" }
//     //     $or: [
//     //         { title: { $regex: searchTerm, $options: "i" } },
//     //         { description: { $regex: searchTerm, $options: "i" } },
//     //         { location: { $regex: searchTerm, $options: "i" } },
//     //     ]
//     // })
//     // Skip formula: pageNumber - 1 * limit
//     const searchQuery = {
//         $or: tourSearchableField.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
//     }
//     // const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit)
//     const filterQuery = Tour.find(filter)
//     const tours = filterQuery.find(searchQuery)
//     const formatedTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)
//     const totalTour = await Tour.countDocuments()
//     const totalPage = Math.ceil(totalTour / limit)
//     const meta = {
//         page: page,
//         limit: limit,
//         total: totalTour,
//         totalPage: totalPage,
//     }
//     return {
//         data: formatedTours,
//         meta: meta
//     }
// }
const getAllTour = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = await queryBuilder
        .search(tour_constant_1.tourSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
};
const createTour = async (payload) => {
    const existingTour = await tour_model_1.Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour Already Exist");
    }
    if (!payload.title) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please give a title");
    }
    // const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`
    // let counter = 0
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }
    // payload.slug = slug
    const tour = await tour_model_1.Tour.create(payload);
    return tour;
};
const updateTour = async (id, payload) => {
    const existingTour = await tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour not found.");
    }
    // if (payload.title) {
    //     const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}-division`
    //     let counter = 0
    //     while (await Tour.exists({ slug })) {
    //         slug = `${slug}-${counter++}`
    //     }
    //     payload.slug = slug
    // }
    // For database
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = { ...payload.images, ...existingTour.images };
    }
    // For database
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImage = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl));
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImage?.includes(imageUrl));
        payload.images = { ...restDBImage, ...updatedPayloadImages };
    }
    const updateTour = await tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true });
    // For cloudinary
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        await Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updateTour;
};
const deleteTour = async (id) => {
    return await tour_model_1.Tour.findByIdAndDelete(id);
};
// Tour Types
const createTourTypes = async (payload) => {
    const existingTourType = await tour_model_1.TourType.findOne({ name: payload.name });
    if (existingTourType) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour type already exist");
    }
    return await tour_model_1.TourType.create({ name });
};
const getAllTourTypes = async () => {
    return await tour_model_1.TourType.find();
};
const updateTourType = async (id, payload) => {
    const existingTourType = await tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour type not found");
    }
    const updateTourType = await tour_model_1.TourType.findByIdAndUpdate(id, payload, { new: true });
    return updateTourType;
};
const deleteTourType = async (id) => {
    const existingTourType = await tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour type not found");
    }
    return await tour_model_1.TourType.findByIdAndDelete(id);
};
exports.TourServices = {
    getAllTour,
    createTour,
    updateTour,
    deleteTour,
    createTourTypes,
    getAllTourTypes,
    updateTourType,
    deleteTourType
};
//# sourceMappingURL=tour.service.js.map