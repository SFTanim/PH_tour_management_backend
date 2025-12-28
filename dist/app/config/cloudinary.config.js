"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.uploadBufferToCloudinary = exports.deleteImageFromCloudinary = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const stream_1 = __importDefault(require("stream"));
// Frontend -> Form data with image file -> Multer will convert Form Data into (Body + File) 
// After Converting Form Data into (Body + File), Malta will put it into a Folder. REQ.FILE = IMAGE
// REQ.FILE -> cloudinary(req.file) -> url -> mongoose -> mongodb
cloudinary_1.v2.config({
    cloud_name: env_1.envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: env_1.envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});
const deleteImageFromCloudinary = async (url) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary_1.v2.uploader.destroy(public_id);
            console.log(`File: ${public_id} is deleted form cloudinery`);
        }
    }
    catch (error) {
        throw new appError_1.default(401, "Cloudinary image deletition failed", error.message);
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
const uploadBufferToCloudinary = async (buffer, fileName) => {
    try {
        return new Promise((resolve, reject) => {
            const public_id = `pdf/${fileName}-${Date.now()}`;
            const bufferStream = new stream_1.default.PassThrough();
            bufferStream.end(buffer);
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: "auto",
                public_id: public_id,
                folder: "pdf"
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }).end(buffer);
        });
    }
    catch (error) {
        throw new appError_1.default(401, `Uploading Buffer to Cloudinary Failed`, error.message);
    }
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.cloudinaryUpload = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.config.js.map