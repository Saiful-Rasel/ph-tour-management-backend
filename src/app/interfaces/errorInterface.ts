export interface TerrorSources {
  path: string;
  message: string;
}
export interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: TerrorSources[];
}