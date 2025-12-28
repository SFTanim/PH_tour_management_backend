import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/appError";
import httpStatus from 'http-status-codes';


const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    }
})

interface ISendEmailOptions {
    to: string,
    templateName: string,
    templateData?: Record<string, string>,
    subject: string,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async (
    {
        to,
        subject,
        templateName,
        templateData,
        attachments
    }: ISendEmailOptions) => {

    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({ filename: attachment.filename, content: attachment.content, contentType: attachment.contentType })),

        })
        // eslint-disable-next-line no-console
        console.log(info)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email Error", error.message)
    }
}