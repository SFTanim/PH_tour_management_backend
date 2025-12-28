"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const division_constant_1 = require("./division.constant");
const division_model_1 = require("./division.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = async (payload) => {
    const existingDivision = await division_model_1.Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "A division with this name already exist.");
    }
    // Commented because we use hook for this
    // const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`
    // let counter = 0
    // while (await Division.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }
    // payload.slug = slug
    const division = await division_model_1.Division.create(payload);
    return division;
};
const getAllDivision = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(division_model_1.Division.find(), query);
    const divisions = await queryBuilder
        .search(division_constant_1.divisionSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        divisions.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
};
const getSingleDivision = async (slug) => {
    const division = await division_model_1.Division.findOne({ slug });
    return {
        data: division
    };
};
const updateDivision = async (id, payload) => {
    const existingDivision = await division_model_1.Division.findById({ id });
    if (!existingDivision) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Division not found");
    }
    const duplicateDivision = await division_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });
    if (duplicateDivision) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "A division with this name already exists.");
    }
    // if (payload.name) {
    //     const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}-division`
    //     let counter = 0
    //     while (await Division.exists({ slug })) {
    //         slug = `${slug}-${counter++}`
    //     }
    //     payload.slug = slug
    // }
    const updateDivision = await division_model_1.Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (payload.thumbnail && existingDivision.thumbnail) {
        await (0, cloudinary_config_1.deleteImageFromCloudinary)(existingDivision.thumbnail);
    }
    return updateDivision;
};
const deleteDivision = async (id) => {
    await division_model_1.Division.findByIdAndDelete(id);
    return null;
};
exports.DivisionServices = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};
//# sourceMappingURL=division.service.js.map