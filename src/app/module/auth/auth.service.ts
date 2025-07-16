import AppError from "../../errorHelper/Apperror";
import { Iuser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";
import { envVar } from "../../config/env";

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
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  };
  const accessToken = generateToken(jwtPayload,envVar.JWT_SECRET as string,envVar.JWT_EXPIREDIN as string)
  return {
    accessToken
  };
};

export const AuthServices = {
  credentialsLogin,
};
