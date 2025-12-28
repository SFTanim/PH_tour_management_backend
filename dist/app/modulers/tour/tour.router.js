"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRouters = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const tour_controller_1 = require("./tour.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const tour_validation_1 = require("./tour.validation");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
/*----------------Tour Type-------------*/
router.get("/tour-types", tour_controller_1.TourController.getAllTourTypes);
router.post("/create-tour-types", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validationRequest)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.TourController.createTourTypes);
router.patch("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validationRequest)(tour_validation_1.createTourTypeZodSchema), tour_controller_1.TourController.updateTourType);
router.delete("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourController.deleteTourType);
/*----------------Tour-------------*/
// Get all
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourController.getAllTour);
// Create New
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validationRequest)(tour_validation_1.createTourZodSchema), tour_controller_1.TourController.createTour);
// Update one
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validationRequest)(tour_validation_1.updateTourZodSchema), tour_controller_1.TourController.updateTour);
// Delete one
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourController.deleteTour);
exports.TourRouters = router;
//# sourceMappingURL=tour.router.js.map