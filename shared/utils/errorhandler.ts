import { createError } from "h3";

export const errorHandler = (statusCode: number, status: number, code: string, statusMessage: string) => {
  return createError({
    statusCode: statusCode,
    status: status,
    message: statusMessage,
    statusMessage: statusMessage,
    data: {
      code: code,
    },
    stack: process.env.NODE_ENV !== "production" ? new Error().stack : "",
  });
};
