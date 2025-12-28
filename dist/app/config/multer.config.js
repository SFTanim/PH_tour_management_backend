"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            // Ex: My Special.Image!@#.png => 324l3kj4324jk-my-special-image-png
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") // remove empty space and replace with hipehen 
                .replace(/\./g, "-") // remove dot and replace with hipehen 
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, ""); // remove alpha numeric like !@ etc 
            // Ex: My Special.Image!@#.png => [My Special, Image!@#, png]
            const fileExtension = file.originalname.split(".").pop(); // == png
            const uniqueFileName = Math
                .random()
                .toString(36)
                .substring(2) +
                "-" + Date.now() +
                "-" + fileName +
                "." + fileExtension;
            return uniqueFileName;
        }
    }
});
exports.multerUpload = (0, multer_1.default)({
    storage: storage
});
//# sourceMappingURL=multer.config.js.map