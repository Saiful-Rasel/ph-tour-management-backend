import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/SEndREsponse"
import httpStatus  from "http-status"
import { AuthServices } from "./auth.service"

const credentialsLogin =  catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
  const loginInfo  = await AuthServices.credentialsLogin(req.body)

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"user logged in successfully",
    data:loginInfo
  })
})

export const AuthControllers = {
    credentialsLogin
}