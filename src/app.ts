import express, { Request, Response } from "express";

import cors from "cors"
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFoun";
import cookieParser from "cookie-parser"
import passport from 'passport'
import expressSession from 'express-session'
import "./app/config/passport"
import { envVar } from "./app/config/env";


const app = express();

app.use(expressSession({
    secret:envVar.EXPRESS_SESSION_SECRET as string,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({extended:true}))


app.use("/api/v1",router)

app.get('/',(req:Request,res:Response) =>{
    res.status(200).json({
        message:"welcome to tour management system backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;