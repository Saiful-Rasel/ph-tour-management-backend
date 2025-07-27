import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../utils/SEndREsponse";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errorHelper/Apperror";
import { setAuthCookie } from "../utils/setCookies";
import { createUserTokens } from "../utils/userToken";
import { envVar } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local",async(err:any ,user:any,info:any)=>{
      if(err){
        return next(new AppError(401,err.message))
      
      }
      if(!user){
         return next(new AppError(401,info.message))
      }
      const userToken = await createUserTokens(user)
    //  delete user.toObject().password
    const {password,...rest} = user.toObject()
    setAuthCookie(res, userToken);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user logged in successfully",
      data: {
        accessToken:userToken.accessToken,
        refreshToken:userToken.refreshToken,
        user:rest
      },
    });
    })(req,res,next)

    // ++++++++++credential login+++++++++++++
    // const loginInfo = await AuthServices.credentialsLogin(req.body);
    // res.cookie("accessToken",loginInfo.accessToken,{
    //   httpOnly:true,
    //   secure:false
    // })
    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //   httpOnly: true,
    //   secure:false
    // });
    // setAuthCookie(res, loginInfo);
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "user logged in successfully",
    //   data: loginInfo,
    // });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No Refresh Token Recieved From Cokkies"
      );
    }
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );
    // res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   secure: false,
    // });
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user logged in successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user logged in successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const newPassword = req.body.newPassword;
    const decodedToken = req.user as JwtPayload;
    await AuthServices.setPassword(  decodedToken.userId ,newPassword);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const decodedToken = req.user ;
    await AuthServices.resetPassword(req.body,decodedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password reset successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed successfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body
    await AuthServices.forgotPassword(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "email send successfully",
      data: null,
    });
  }
);

const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? req.query.state as string : "" 
    if(redirectTo.startsWith('/')){
      redirectTo = redirectTo.slice(1)
    }
    const user = req.user;
    console.log("google-user" ,user)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
    const tokenInfo =  createUserTokens(user);
    setAuthCookie(res,tokenInfo)
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Password changed successfully",
    //   data: null,
    // });
    res.redirect(`${envVar.FRONTEND_URL as string}/${redirectTo}`)
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallback,
  changePassword,
  forgotPassword,
  setPassword
};
