/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes';
import { ITour } from "./tour.interface";


// Tour
const getAllTour = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await TourServices.getAllTour(query as Record<string, string>)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "All Tours Retrieved successfully",
        data: result.data,
        meta: result.meta
    })
})

const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // console.log({
    //     files: req.files,
    //     body: req.body
    // })
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[])?.map(file => file.path)
    }

    const tour = await TourServices.createTour(payload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Tour Created Successfully",
        data: tour
    })
})

const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[])?.map(file => file.path)
    }

    const result = await TourServices.updateTour(req.params.id as string, payload)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });

})

const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await TourServices.deleteTour(req.params.id as string)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
})


// Tour-Types
const createTourTypes = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await TourServices.createTourTypes(name);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
})

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await TourServices.getAllTourTypes();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
})

const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await TourServices.updateTourType(id as string, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
})

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TourServices.deleteTourType(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
})


export const TourController = {
    getAllTour,
    createTour,
    updateTour,
    deleteTour,
    createTourTypes,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}