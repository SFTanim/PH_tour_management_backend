import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
export declare const deleteImageFromCloudinary: (url: string) => Promise<void>;
export declare const uploadBufferToCloudinary: (buffer: Buffer, fileName: string) => Promise<UploadApiResponse | undefined>;
export declare const cloudinaryUpload: typeof cloudinary;
//# sourceMappingURL=cloudinary.config.d.ts.map