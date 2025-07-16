import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/SEndREsponse";
import { verifyToken } from "../../utils/jwt";
import { envVar } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";



// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("lfdaslf")
//     // throw new AppError(httpStatus.BAD_REQUEST,"message not found from apperror")
//     const user = await userServices.createUser(req.body);
//     res.status(httpStatus.CREATED).json({
//       message: "user created successfully",
//       user,
//     });
//   } catch (error: any) {
//     next(error)
//   }
// };

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
  const user = await userServices.createUser(req.body)
   sendResponse(res,{
    statusCode:httpStatus.CREATED,
    success:true,
    message:"user created successfully",
    data:user,
    

   })
})

// const getAllUser = async(req: Request, res: Response, next: NextFunction)=>{
//   try {
//     const alluser = await userServices.getAllUser()
//     res.status(httpStatus.CREATED).json({
//       message: "user created successfully",
//       alluser
    
//     });
//   } catch (error:any) {
//     next(error)
//   }
// }

const getAllUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
  const getAllUser = await userServices.getAllUser()
  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"all data retrived successfully",
    data:getAllUser.data,
    meta:getAllUser.meta
  })
})

const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
 const userId = req.params.id
//  const token = req.headers.authorization
//  const vefiedToeken = verifyToken(token as string,envVar.JWT_SECRET as string) as JwtPayload
const verifiedToken = req.user
 const payload = req.body

 const user = await userServices.updateUser(userId,payload,verifiedToken)
  sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"user updated successfully",
     data:user
  })
})

export const userControllers = {
  createUser,
  getAllUser,
  updateUser
};


