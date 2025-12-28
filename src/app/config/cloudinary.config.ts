/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/appError";
import Stream from "stream";

// Frontend -> Form data with image file -> Multer will convert Form Data into (Body + File) 
// After Converting Form Data into (Body + File), Malta will put it into a Folder. REQ.FILE = IMAGE
// REQ.FILE -> cloudinary(req.file) -> url -> mongoose -> mongodb



cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
})


export const deleteImageFromCloudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i

        const match = url.match(regex)
        if (match && match[1]) {
            const public_id = match[1]
            await cloudinary.uploader.destroy(public_id)
            console.log(`File: ${public_id} is deleted form cloudinery`)
        }
    } catch (error: any) {
        throw new AppError(401, "Cloudinary image deletition failed", error.message)
    }

}

export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
    try {
        return new Promise((resolve, reject) => {
            const public_id = `pdf/${fileName}-${Date.now()}`
            const bufferStream = new Stream.PassThrough()
            bufferStream.end(buffer)

            cloudinary.uploader.upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf"
            },
                (error, result) => {
                    if (error) { return reject(error) }
                    resolve(result)
                }
            ).end(buffer)
        })

    } catch (error: any) {
        throw new AppError(401, `Uploading Buffer to Cloudinary Failed`, error.message)
    }
}

export const cloudinaryUpload = cloudinary


