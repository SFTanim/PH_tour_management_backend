export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}
export declare const generatePDF: (invoiceData: IInvoiceData) => Promise<Buffer<ArrayBufferLike>>;
//# sourceMappingURL=invoice.d.ts.map