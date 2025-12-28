"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errorSources = [];
    err.issues.foreach((issue) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            // path : "nichname inside lastname inside name"
            // path: issue.path.length > 1 && issue.path.reverse().join("inside "),
            message: issue.message
        });
    });
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    };
};
exports.handleZodError = handleZodError;
//# sourceMappingURL=handleZodError.js.map