import { NextFunction ,Request,Response} from "express";
import AppError from "../errorHelper/Apperror";
import { envVar } from "../config/env";
import { verifyToken } from "../utils/jwt";
import httpStatus from "http-status"
import { JwtPayload } from "jsonwebtoken";
import { User } from "../module/user/user.model";
import { isActive } from "../module/user/user.interface";

export const checkAuth = (...authRoles : string[]) => async(req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(403, "No token received");
    }
    const verifiedToken = verifyToken(accessToken, envVar.JWT_SECRET as string) as JwtPayload;
     const isUserExist = await User.findOne({ email: verifiedToken.email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email Doesnot Exist");
  }
  if (
    isUserExist.isActive === isActive.BLOCKED ||
    isUserExist.isActive === isActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `user is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "user is deleted");
  }
 if(!isUserExist.isVerified){
    throw new AppError(httpStatus.BAD_REQUEST, "user is not verified");
 }

    if (!verifiedToken) {
      throw new AppError(403, "You are not authorized");
    }
   if(!authRoles.includes(verifiedToken.role ) ){
    throw new AppError(403, "You are not permitted to view this route!!!")
   }
   req.user = verifiedToken
    next();
  } catch (error) {
    next(error);
  }
};
