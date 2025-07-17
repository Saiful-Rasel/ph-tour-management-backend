import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVar } from "./env";
import { User } from "../module/user/user.model";
import { Role } from "../module/user/user.interface";

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

        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                email,
                name:profile.displayName,
                picture:profile.photos?.[0].value,
                role:Role.USER,
                isVerified:true,
                auths:[
                    {
                        provider:"Google",
                        providerId:profile.id
                    }
                ]
            })

            
        }
        return done(null,user)
      } catch (error) {
        console.log("google strategyError", error)
        return done(error)
      }
    }
  )
);


passport.serializeUser((user:any, done: (err: any, id?: unknown)=>void)=>{
  done(null,user._id)
})

passport.deserializeUser(async(id:string,done:any)=>{
  try {
    const user = await User.findById(id)
    done( null,user)
  } catch (error) {
    console.log(error)
    done(error)
  }
})