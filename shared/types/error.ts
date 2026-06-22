interface ErrorResponse {
  code: string;
  message: string;
}

export interface ApiError {
  statusCode: number;
  statusMessage: string;
  data: ErrorResponse;
}