import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../module/user/user.model";
import AppError from "../errorHelper/Apperror";

import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../utils/userToken";
import { Iuser } from "../module/user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";

const credentialsLogin = async (payload: Partial<Iuser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email Doesnot Exist");
  }
  const isUserPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isUserPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "password doesnot match");
  }
  // const jwtPayload = {
  //   userId: isUserExist._id,
  //   email: isUserExist.email,
  //   role: isUserExist.role
  // };
  // const accessToken = generateToken(jwtPayload,envVar.JWT_SECRET as string,envVar.JWT_EXPIREDIN as string)
  // const refreshToken = generateToken(jwtPayload,envVar.JWT_REFRESH_SECRET,envVar.JWT_REFRESH_EXPIRES)
  const usersToken = createUserTokens(isUserExist);
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    accessToken: usersToken.accessToken,
    refreshToken: usersToken.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

  return {
    accessToken:newAccessToken,
  };
};


const resetPassword = async(oldPassword:string,newPassword:string,decodedToken : JwtPayload) =>{

  const user = await User.findById(decodedToken.userId)
  const isOldPasswordMathch = await bcrypt.compare(oldPassword,user!.password as string)

  if(!isOldPasswordMathch){
    throw new AppError(httpStatus.UNAUTHORIZED, "old Password Does not Match")
  }
  user!.password = await bcrypt.hash(newPassword,Number(envVar.BCRYPT_SALT_ROUND))
  user!.save()

}

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword
};
