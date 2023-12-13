const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import { compare, hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
            clientID:
                "231595875353-cvciijblts2rqpu3hr3sn6040f7nhgda.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:8000/auth/google/callback",
        },
        async (
            accessToken: any,
            refreshToken: any,
            profile: any,
            done: (arg0: null, arg1: any) => any
        ) => {
            try {
                const userEmail = profile._json.email;
                console.log(userEmail)
                const userName = profile.displayName || 'Default Name';
                const userGoogleId = profile.id;

                let user = await prisma.user.findUnique({
                    where: { email: userEmail },
                });

                if (!user) {
                    const hashPassword = await hash(userGoogleId, 10);
                    user = await prisma.user.create({
                        data: {
                            email: userEmail,
                            name: userName,
                            password: hashPassword,
                        },
                    });

                } else {
                    console.log('Email already exists. Logging in instead.')
                }

                return done(null, user);
            } catch (error: any) {
                return done(error, undefined);
            }
        }
    )
);

// Serialize the user
passport.serializeUser(
    (user: { id: any }, done: (arg0: null, arg1: any) => void) => {
        done(null, user.id);
    }
);

// Deserialize the user
passport.deserializeUser(
    async (
        id: number,
        done: (
            arg0: null,
            arg1:
                | {
                    id: number;
                    email: string;
                    name: string;
                    password: string;
                    createdAt: Date;
                    updatedUt: Date;
                }
                | null
                | undefined
        ) => void
    ) => {
        try {
            const user = await prisma.user.findUnique({ where: { id } });
            done(null, user);
        } catch (error: any) {
            done(error, undefined);
        }
    }
);
