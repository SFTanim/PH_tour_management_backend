import { Response } from "express";
export interface IAuthTokens {
    accessToken?: string;
    refreshToken?: string;
}
export declare const setAuthCookies: (res: Response, tokenInfo: IAuthTokens) => void;
//# sourceMappingURL=setCookies.d.ts.map