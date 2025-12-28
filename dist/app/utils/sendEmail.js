"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(env_1.envVars.EMAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: env_1.envVars.EMAIL_SENDER.SMTP_USER,
        pass: env_1.envVars.EMAIL_SENDER.SMTP_PASS
    }
});
const sendEmail = async ({ to, subject, templateName, templateData, attachments }) => {
    try {
        const templatePath = path_1.default.join(__dirname, `templates/${templateName}.ejs`);
        const html = await ejs_1.default.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: env_1.envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({ filename: attachment.filename, content: attachment.content, contentType: attachment.contentType })),
        });
        // eslint-disable-next-line no-console
        console.log(info);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email Error", error.message);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map