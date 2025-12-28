"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectId. Please provide valid id."
    };
};
exports.handleCastError = handleCastError;
//# sourceMappingURL=handleCastError.js.map