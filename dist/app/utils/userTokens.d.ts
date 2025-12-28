import { IUser } from "../modulers/user/user.interface";
export declare const createUserTokens: (user: Partial<IUser>) => {
    accessToken: string;
    refreshToken: string;
};
export declare const createAccessTokenWithRefreshToken: (refreshToken: string) => Promise<string>;
//# sourceMappingURL=userTokens.d.ts.map