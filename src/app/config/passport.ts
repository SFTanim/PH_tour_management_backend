/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as localStrategy } from "passport-local";
import { envVars } from "./env";
import { User } from "../modulers/user/user.model";
import { IsActive, Role } from "../modulers/user/user.interface";
import bcryptjs from 'bcryptjs';


// For Local Login using Passport
passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email: string, password: string, done) => {
    try {
        const isUserExist = await User.findOne({ email })

        if (!isUserExist) {
            return done(null, false, { message: "User doesn't exist" })
            // return done("User doesn't exist")
        }
        if (!isUserExist.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
            return done("User is not verified")
        }
        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
            return done(`User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
            return done("User is deleted")
        }


        const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google")

        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, { message: "You have authenticated through google login. So if you want to login in with credentials, then at first login with google and set a password for your gmail and then you can login with email and password." })
        }

        const isPassMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

        if (!isPassMatched) {
            return done(null, false, { message: "Password doesn't match" })
        }

        return done(null, isUserExist)

    } catch (error) {
        console.log(error)
        done(error)
    }
}))


// For Google Login
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0]?.value
                if (!email) {
                    return done(null, false, { message: "No email found" })
                }
                let user = await User.findOne({ email })

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0]?.value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [{ provider: "google", providerId: profile.id }]
                    })
                }
                return done(null, user)
            } catch (error) {
                console.log("Google strategy error: ", error)

                return done(error)
            }
        }
    )
)


// frontend localhost:5173/login?redirect=/booking -> localhost:5000/api/v1/auth/google?redirect=/booking -> passport -> Google OAuth Consent Screen -> Gmail login -> successful -> callback url: localhost:5000/api/v1/auth/google/callback -> db store -> token
// Custom auth -> email, pass, role, name -> registration -> DB -> 1 user created
// Google auth -> req -> google -> successfull : JWT token : User details -> DB -> store


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        console.log(error)
        done(error)
    }
})