declare class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string, stack?: '');
}
export default AppError;
//# sourceMappingURL=appError.d.ts.map