import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchableField } from "./division.constant";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatus from 'http-status-codes';



const createDivision = async (payload: IDivision) => {
    const existingDivision = await Division.findOne({ name: payload.name })
    if (existingDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, "A division with this name already exist.")
    }

    // Commented because we use hook for this
    // const baseSlug = payload.name.toLocaleLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`

    // let counter = 0
    // while (await Division.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }

    // payload.slug = slug

    const division = await Division.create(payload)

    return division

}

const getAllDivision = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Division.find(), query)
    const divisions = await queryBuilder
        .search(divisionSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        divisions.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleDivision = async (slug: string) => {
    const division = await Division.findOne({ slug })
    return {
        data: division
    }
}

const updateDivision = async (id: string, payload: Partial<IDivision>) => {
    const existingDivision = await Division.findById({ id })
    if (!existingDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, "Division not found")
    }

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });

    if (duplicateDivision) {
        throw new AppError(httpStatus.BAD_REQUEST, "A division with this name already exists.")
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

    const updateDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
    if (payload.thumbnail && existingDivision.thumbnail) {
        await deleteImageFromCloudinary(existingDivision.thumbnail)
    }
    return updateDivision
}

const deleteDivision = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null
}

export const DivisionServices = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision,

}