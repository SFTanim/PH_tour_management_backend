"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const env_1 = require("./env");
const user_model_1 = require("../modulers/user/user.model");
const user_interface_1 = require("../modulers/user/user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// For Local Login using Passport
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    try {
        const isUserExist = await user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User doesn't exist" });
            // return done("User doesn't exist")
        }
        if (!isUserExist.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
            return done("User is not verified");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
            return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
            return done("User is deleted");
        }
        const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, { message: "You have authenticated through google login. So if you want to login in with credentials, then at first login with google and set a password for your gmail and then you can login with email and password." });
        }
        const isPassMatched = await bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPassMatched) {
            return done(null, false, { message: "Password doesn't match" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
// For Google Login
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(null, false, { message: "No email found" });
        }
        let user = await user_model_1.User.findOne({ email });
        if (!user) {
            user = await user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: profile.photos?.[0]?.value,
                role: user_interface_1.Role.USER,
                isVerified: true,
                auths: [{ provider: "google", providerId: profile.id }]
            });
        }
        return done(null, user);
    }
    catch (error) {
        console.log("Google strategy error: ", error);
        return done(error);
    }
}));
// frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent Screen -> Gmail login -> successful -> callback url: localhost:5000/api/v1/auth/google/callback -> db store -> token
// Custom auth -> email, pass, role, name -> registration -> DB -> 1 user created
// Google auth -> req -> google -> successfull : JWT token : User details -> DB -> store
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
});
//# sourceMappingURL=passport.js.map