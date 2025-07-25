import { TGenericErrorResponse } from "../interfaces/errorInterface";

export const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${match[1]} already exist`,
     errorSources: [],
  };
};
