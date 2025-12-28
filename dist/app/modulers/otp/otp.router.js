"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRouters = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const router = (0, express_1.Router)();
router.post("/send", otp_controller_1.OTPController.sendOTP);
router.post("/verify", otp_controller_1.OTPController.verifyOTP);
exports.OtpRouters = router;
//# sourceMappingURL=otp.router.js.map