/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("Connected to Database")

        server = app.listen(envVars.PORT, () => {
            console.log("Server is listening to port: ", envVars.PORT)
        })
    } catch (error) {
        console.log("Server Error: ", error)
    }
}

startServer()

// Module 25-10
// Signal Terminatio SIGTERM
process.on("SIGTERM", () => {
    console.log("SIGTERM Detected..... Server is shutting down..")
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// Signal Manual Terminatio SIGINT
process.on("SIGINT", () => {
    console.log("SIGINT - Signal Manual Terminatio Detected..... Server is shutting down..")
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// Unhandle Rejection Error
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection Detected..... Server is shutting down..", error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// Uncaught Rejection Error
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception Detected..... Server is shutting down..", error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
