import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVar } from "./env";
import { User } from "../module/user/user.model";
import { isActive, Role } from "../module/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import AppError from "../errorHelper/Apperror";
import httpStatus from "http-status";
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "user does Not Exist" });
        }
        if (
          isUserExist.isActive === isActive.BLOCKED ||
          isUserExist.isActive === isActive.INACTIVE
        ) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `user is ${isUserExist.isActive}`
          // );
          done(`user is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
          throw new AppError(httpStatus.BAD_REQUEST, "user is deleted");
          // done("user is deleted")
        }
        if (!isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "user is not verified");
          done("user in not verified");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObject) => providerObject.provider == "Google"
        );
        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "you have authenticated to goole login . if you want to login with credential at first login google and set passwor and then you login email and password",
          });
        }
        const isUserPasswordMatch = await bcrypt.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isUserPasswordMatch) {
          return done(null, false, { message: "password Doesnot Match" });
        }
        done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVar.GOOGLE_CLIENT_ID as string,
      clientSecret: envVar.GOOGLE_CLIENT_SECRET as string,
      callbackURL: envVar.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No Email Found" });
        }

        let isUserExist = await User.findOne({ email });
        if (
          isUserExist &&
          (isUserExist.isActive === isActive.BLOCKED ||
            isUserExist.isActive === isActive.INACTIVE)
        ) {
          // throw new AppError(
          //   httpStatus.BAD_REQUEST,
          //   `user is ${isUserExist.isActive}`
          // );
          return done(`user is ${isUserExist.isActive}`);
        }
        if (isUserExist && isUserExist.isDeleted) {
          return done(`user is deleted`);
        }
        if (isUserExist && !isUserExist.isVerified) {
          // throw new AppError(httpStatus.BAD_REQUEST, "user is not verified");

         return done("user in not verified");
        }
        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "Google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, isUserExist);
      } catch (error) {
        console.log("google strategyError", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
