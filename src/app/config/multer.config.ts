import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            // Ex: My Special.Image!@#.png => 324l3kj4324jk-my-special-image-png
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") // remove empty space and replace with hipehen 
                .replace(/\./g, "-") // remove dot and replace with hipehen 
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, "") // remove alpha numeric like !@ etc 

            // Ex: My Special.Image!@#.png => [My Special, Image!@#, png]
            const fileExtension = file.originalname.split(".").pop() // == png

            const uniqueFileName = Math
                .random()
                .toString(36)
                .substring(2) +
                "-" + Date.now() +
                "-" + fileName +
                "." + fileExtension

            return uniqueFileName
        }
    }
})


export const multerUpload = multer({
    storage: storage
})