interface ISendEmailOptions {
    to: string;
    templateName: string;
    templateData?: Record<string, string>;
    subject: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType: string;
    }[];
}
export declare const sendEmail: ({ to, subject, templateName, templateData, attachments }: ISendEmailOptions) => Promise<void>;
export {};
//# sourceMappingURL=sendEmail.d.ts.map