export type AuthResponse<T = unknown> = {
  statusCode: number;
  data?: T;
  error?: string;
};