import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/appError"
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableField } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface"
import { Tour, TourType } from "./tour.model"
import httpStatus from 'http-status-codes';



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




const getAllTour = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Tour.find(), query)

    const tours = await queryBuilder
        .search(tourSearchableField)
        .filter()
        .sort()
        .fields()
        .paginate()


    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const createTour = async (payload: Partial<ITour>) => {
    const existingTour = await Tour.findOne({ title: payload.title })

    if (existingTour) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour Already Exist")
    }
    if (!payload.title) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please give a title")
    }

    // const baseSlug = payload.title.toLocaleLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}-division`

    // let counter = 0
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}`
    // }

    // payload.slug = slug

    const tour = await Tour.create(payload)

    return tour
}

const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id)
    if (!existingTour) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour not found.")
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
        payload.images = { ...payload.images, ...existingTour.images }
    }

    // For database
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImage = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))

        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImage?.includes(imageUrl))

        payload.images = { ...restDBImage, ...updatedPayloadImages }
    }

    const updateTour = await Tour.findByIdAndUpdate(id, payload, { new: true })

    // For cloudinary
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        await Promise.all(payload.deleteImages.map(url => deleteImageFromCloudinary(url)))
    }


    return updateTour
}

const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id)
}


// Tour Types
const createTourTypes = async (payload: ITourType) => {
    const existingTourType = await TourType.findOne({ name: payload.name })

    if (existingTourType) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour type already exist")
    }

    return await TourType.create({ name })
}

const getAllTourTypes = async () => {
    return await TourType.find()
}

const updateTourType = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id)

    if (!existingTourType) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour type not found")
    }

    const updateTourType = await TourType.findByIdAndUpdate(id, payload, { new: true })

    return updateTourType
}

const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id)

    if (!existingTourType) {
        throw new AppError(httpStatus.BAD_REQUEST, "Tour type not found")
    }

    return await TourType.findByIdAndDelete(id)
}


export const TourServices = {
    getAllTour,
    createTour,
    updateTour,
    deleteTour,
    createTourTypes,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}