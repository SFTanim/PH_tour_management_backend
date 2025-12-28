import { Request, Response } from "express";
export declare const PaymentController: {
    successPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    failPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    cancelPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    initPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getInvoiceDownloadUrl: (req: Request, res: Response, next: import("express").NextFunction) => void;
    validatePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=payment.controller.d.ts.map