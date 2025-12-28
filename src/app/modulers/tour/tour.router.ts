import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { validationRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { multerUpload } from "../../config/multer.config";


const router = Router()

/*----------------Tour Type-------------*/
router.get("/tour-types", TourController.getAllTourTypes)

router.post("/create-tour-types", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validationRequest(createTourTypeZodSchema), TourController.createTourTypes)

router.patch("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validationRequest(createTourTypeZodSchema), TourController.updateTourType)

router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType)



/*----------------Tour-------------*/
// Get all
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.getAllTour)

// Create New
router.post("/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validationRequest(createTourZodSchema),
    TourController.createTour
)

// Update one
router.patch("/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validationRequest(updateTourZodSchema),
    TourController.updateTour)

// Delete one
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour)




export const TourRouters = router