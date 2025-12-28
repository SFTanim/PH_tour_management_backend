"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const division_service_1 = require("./division.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // console.log({
    //     file: req.file,
    //     body: req.body
    // })
    const payload = {
        ...req.body,
        thumbnail: req.file?.path
    };
    const result = await division_service_1.DivisionServices.createDivision(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result,
    });
});
const getAllDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const result = await division_service_1.DivisionServices.getAllDivision(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
        meta: result.meta,
    });
});
const getSingleDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const slug = req.params.slug;
    const result = await division_service_1.DivisionServices.getSingleDivision(slug);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Particular division retrieved",
        data: result.data,
    });
});
const updateDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const payload = {
        ...req.body,
        thumbnail: req.file?.path
    };
    const result = await division_service_1.DivisionServices.updateDivision(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
});
const deleteDivision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const result = await division_service_1.DivisionServices.deleteDivision(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
});
exports.DivisionController = {
    createDivision,
    getAllDivision,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};
//# sourceMappingURL=division.controller.js.map