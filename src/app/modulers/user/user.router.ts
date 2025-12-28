import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validationRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router()


router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe)

router.post("/register",
    validationRequest(createUserZodSchema),
    multerUpload.single("file"),
    UserController.createUser)

router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserController.getSingleUser)
router.patch("/:id", validationRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser)



export const UserRouters = router