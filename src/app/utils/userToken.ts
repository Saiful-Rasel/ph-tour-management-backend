//  const accessToken = generateToken(jwtPayload,envVar.JWT_SECRET as string,envVar.JWT_EXPIREDIN as string)
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import AppError from "../errorHelper/Apperror";
import { isActive, Iuser } from "../module/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../module/user/user.model";

//   const refreshToken = generateToken(jwtPayload,envVar.JWT_REFRESH_SECRET,envVar.JWT_REFRESH_EXPIRES)
export const createUserTokens = (user: Partial<Iuser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVar.JWT_SECRET as string,
    envVar.JWT_EXPIREDIN as string
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVar.JWT_REFRESH_SECRET,
    envVar.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken,
  };
};


export const createNewAccessTokenWithRefreshToken = async(refreshToken:string) =>{
const verifyRefreshToken = verifyToken(
    refreshToken,
    envVar.JWT_REFRESH_SECRET
  ) as JwtPayload;
  const isUserExist = await User.findOne({ email: verifyRefreshToken.email });
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
  const payload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    payload,
    envVar.JWT_SECRET as string,
    envVar.JWT_EXPIREDIN as string
  );
  return accessToken

}