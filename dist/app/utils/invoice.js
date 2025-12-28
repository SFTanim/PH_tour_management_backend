"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const pdfkit_1 = __importDefault(require("pdfkit"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const generatePDF = async (invoiceData) => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));
            // PDF content
            doc.fontSize(20).text("Invoice", { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`Transaction ID: ${invoiceData.transactionId}`);
            doc.fontSize(14).text(`Booking Date: ${invoiceData.bookingDate}`);
            doc.fontSize(14).text(`Customer Name: ${invoiceData.userName}`);
            doc.moveDown();
            doc.text(`Tour: ${invoiceData.tourTitle}`);
            doc.text(`Guests: ${invoiceData.guestCount}`);
            doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown();
            doc.text("Thank you for booking with us!", { align: "center" });
            doc.end();
        });
    }
    catch (error) {
        console.log(error);
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "PDF creating error");
    }
};
exports.generatePDF = generatePDF;
//# sourceMappingURL=invoice.js.map