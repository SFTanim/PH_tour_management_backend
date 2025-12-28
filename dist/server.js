"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const redis_config_1 = require("./app/config/redis.config");
let server;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Connected to Database");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log("Server is listening to port: ", env_1.envVars.PORT);
        });
    }
    catch (error) {
        console.log("Server Error: ", error);
    }
};
(async () => {
    await (0, redis_config_1.connectRedis)();
    await startServer();
    await (0, seedSuperAdmin_1.seedSuperAdmin)();
})();
// Module 25-10
// Signal Terminatio SIGTERM
process.on("SIGTERM", () => {
    console.log("SIGTERM Detected..... Server is shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Signal Manual Terminatio SIGINT
process.on("SIGINT", () => {
    console.log("SIGINT - Signal Manual Terminatio Detected..... Server is shutting down..");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Unhandle Rejection Error
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection Detected..... Server is shutting down..", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Uncaught Rejection Error
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception Detected..... Server is shutting down..", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//# sourceMappingURL=server.js.map