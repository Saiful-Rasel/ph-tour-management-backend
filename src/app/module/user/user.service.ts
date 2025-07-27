import AppError from "../../errorHelper/Apperror";
import { IauthProvider, Iuser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../../config/env";

const createUser = async (payload: Partial<Iuser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  // if (isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User already Exist");
  // }
  const authProvider: IauthProvider = {
    provider: "Credentials",
    providerId: email as string,
  };
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<Iuser>,
  decodedToken: JwtPayload
) => {
  console.log(userId, payload, decodedToken);
  const ifUserExist = await User.findById(userId);
  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized");
    }
  }

  if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "you are not authorized");
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN, "you are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVar.BCRYPT_SALT_ROUND)
    );
  }
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdatedUser;
};

const getAllUser = async () => {
  const user = await User.find({});
  const totalUser = await User.countDocuments();
  return {
    data: user,
    meta: {
      total: totalUser,
    },
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  return {
    data: user
  };
};

export const userServices = {
  createUser,
  getAllUser,
  updateUser,
  getMe,
};
