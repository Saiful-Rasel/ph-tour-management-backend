import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../module/user/user.model";
import AppError from "../errorHelper/Apperror";
import { createNewAccessTokenWithRefreshToken } from "../utils/userToken";
import { IauthProvider, isActive, Iuser } from "../module/user/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { envVar } from "../config/env";
import Jwt from "jsonwebtoken";
import { sendEamil } from "../utils/sendEmail";

// const credentialsLogin = async (payload: Partial<Iuser>) => {
//   const { email, password } = payload;
//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email Doesnot Exist");
//   }
//   const isUserPasswordMatch = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isUserPasswordMatch) {
//     throw new AppError(httpStatus.BAD_REQUEST, "password doesnot match");
//   }
//   // const jwtPayload = {
//   //   userId: isUserExist._id,
//   //   email: isUserExist.email,
//   //   role: isUserExist.role
//   // };
//   // const accessToken = generateToken(jwtPayload,envVar.JWT_SECRET as string,envVar.JWT_EXPIREDIN as string)
//   // const refreshToken = generateToken(jwtPayload,envVar.JWT_REFRESH_SECRET,envVar.JWT_REFRESH_EXPIRES)
//   const usersToken = createUserTokens(isUserExist);
//   const { password: pass, ...rest } = isUserExist.toObject();
//   return {
//     accessToken: usersToken.accessToken,
//     refreshToken: usersToken.refreshToken,
//     user: rest,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload
) => {
  if (payload.id != decodedToken.userId) {
    throw new AppError(401, "you cannot reset your password");
  }
  const isUserExist = await User.findById(decodedToken.userId)
  if(!isUserExist){
    throw new AppError(401, "user doesn,t exist");
  }

  const hashPassword = await bcrypt.hash(payload.password ,Number(envVar.BCRYPT_SALT_ROUND))
  isUserExist.password = hashPassword
  await isUserExist.save()
  return {};
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "user not found");
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === "Google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you already set password if you again set password go to your profile again"
    );
  }

  const hashPassword = await bcrypt.hash(
    plainPassword,
    Number(envVar.BCRYPT_SALT_ROUND)
  );

  const creadentialProvider: IauthProvider = {
    provider: "Credentials",
    providerId: user.email,
  };

  const auths: IauthProvider[] = [...user.auths, creadentialProvider];
  (user.password = hashPassword), (user.auths = auths);
  await user.save();
  return {};
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
  const isOldPasswordMathch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );

  if (!isOldPasswordMathch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "old Password Does not Match");
  }
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVar.BCRYPT_SALT_ROUND)
  );
  user!.save();
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

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
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "user is not verified");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = Jwt.sign(jwtPayload, envVar.JWT_SECRET as string, {
    expiresIn: "10m",
  });

  const resetUiLink = `${envVar.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
  sendEamil({
    to: isUserExist.email,
    subject: "Password-reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUiLink,
    },
  });
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword,
};
