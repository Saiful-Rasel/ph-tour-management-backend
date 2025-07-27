import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHelper/Apperror";
import { handleDuplicateError } from "../helper/handleDuplicateError";
import { handleCastError } from "../helper/handleCastERror";
import { handleValidationError } from "../helper/HandleValidationEror";
import { hanldeZodError } from "../helper/HandleZodError";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";
import multer from "multer";

export const globalErrorHandler = async(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(envVar.node_env === 'development'){
    console.log(error)
  }
  if(req.file){
    await deleteImageFromCloudinary(req.file.path)
  }
   if(req.files && Array.isArray(req.files) && req.files.length ){
   const imageUrls = (req.files as Express.Multer.File[]).map(file=> file.path)
   await Promise.all(imageUrls.map(url => deleteImageFromCloudinary(url)))
  }
  let errorSources: any = [];
  let statusCode = 500;
  let message = `something went wrong ${error.message} `;
  // duplicate error
  if (error.code === 11000) {
    const simpliSyedError = handleDuplicateError(error);
    statusCode = simpliSyedError.statusCode;
    message = simpliSyedError.message;
  }
  //  CastError
  else if (error.name === "CastError") {
    const simplifyError = handleCastError(error);
    (statusCode = simplifyError.statusCode), (message = simplifyError.message);
  } else if (error.name === "ValidationError") {
    const simplifyError = handleValidationError(error);
    (statusCode = simplifyError.statusCode),
      (errorSources = simplifyError.errorSources),
      (message = simplifyError.message);
  }
  // zod error  must be path lastone if 10-1 equal last
  else if (error.name === "ZodError") {
    const simplifyError = hanldeZodError(error);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorSources = simplifyError.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    (statusCode = statusCode), (message = error.message);
  }

  res.status(statusCode).json({
    message,
    success: false,
    errorSources,
    error: envVar.node_env === "development" ? error : null,
    stack: envVar.node_env === "development" ? error.stack : null,
  });
  next();
};
