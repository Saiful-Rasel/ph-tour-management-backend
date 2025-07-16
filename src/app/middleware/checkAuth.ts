import { NextFunction ,Request,Response} from "express";
import AppError from "../errorHelper/Apperror";
import { envVar } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { string } from "zod";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles : string[]) => async(req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(403, "No token received");
    }
    const verifiedToken = verifyToken(accessToken, envVar.JWT_SECRET as string) as JwtPayload;
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
