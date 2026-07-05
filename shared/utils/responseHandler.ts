import { HttpStatus } from "./httpstatus";

export const responseHandler = <T>(
  code: string,
  statusMessage: string,
  data: T,
) => {
  return {
    statusCode: HttpStatus.OK,
    status: HttpStatus.OK,
    code,
    message: statusMessage,
    statusMessage,
    data,
    stack: process.env.STAGE !== "prod" ? new Error().stack : undefined,
  };
};