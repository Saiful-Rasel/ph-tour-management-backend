import { NextFunction, Request, Response } from "express";
import { envVar } from "../config/env";
import AppError from "../errorHelper/Apperror";

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `something went wrong ${error.message} `;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }else if (error instanceof Error){
    statusCode = statusCode,
    message = error.message
  }

  res.status(statusCode).json({
    message,
    error,
    stack: envVar.node_env === "development" ? error.stack : null,
  });
  next();
};
