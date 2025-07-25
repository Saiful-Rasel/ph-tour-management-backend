import mongoose from "mongoose";
import { TerrorSources } from "../interfaces/errorInterface";

export  const handleValidationError = (error: mongoose.Error.ValidationError) => {
  const errorSources: TerrorSources[] = [];
  const errors = Object.values(error.errors);
  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );
  return {
    statusCode: 400,
    message: "validation error",
    errorSources,
  };
};