"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const tour_service_1 = require("./tour.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Tour
const getAllTour = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const result = await tour_service_1.TourServices.getAllTour(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "All Tours Retrieved successfully",
        data: result.data,
        meta: result.meta
    });
});
const createTour = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    // console.log({
    //     files: req.files,
    //     body: req.body
    // })
    const payload = {
        ...req.body,
        images: req.files?.map(file => file.path)
    };
    const tour = await tour_service_1.TourServices.createTour(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Tour Created Successfully",
        data: tour
    });
});
const updateTour = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const payload = {
        ...req.body,
        images: req.files?.map(file => file.path)
    };
    const result = await tour_service_1.TourServices.updateTour(req.params.id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });
});
const deleteTour = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const result = await tour_service_1.TourServices.deleteTour(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
});
// Tour-Types
const createTourTypes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name } = req.body;
    const result = await tour_service_1.TourServices.createTourTypes(name);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});
const getAllTourTypes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await tour_service_1.TourServices.getAllTourTypes();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});
const updateTourType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await tour_service_1.TourServices.updateTourType(id, name);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});
const deleteTourType = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await tour_service_1.TourServices.deleteTourType(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});
exports.TourController = {
    getAllTour,
    createTour,
    updateTour,
    deleteTour,
    createTourTypes,
    getAllTourTypes,
    updateTourType,
    deleteTourType
};
//# sourceMappingURL=tour.controller.js.map