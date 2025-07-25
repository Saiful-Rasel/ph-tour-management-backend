import { TerrorSources, TGenericErrorResponse } from "../interfaces/errorInterface";

export const hanldeZodError = (error: any): TGenericErrorResponse => {
  const errorSources: TerrorSources[] = [];

  error.issues.forEach((issue: any) =>
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    })
  );
  return {
    statusCode: 400,
    message: "zod Error",
    errorSources,
  };
};