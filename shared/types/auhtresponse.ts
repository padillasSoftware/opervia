export type AuthResponse<T = unknown> = {
  statusCode: number;
  data?: T;
  error?: string;
};

export type ApiResponse<T> = {
  statusCode: number;
  status: number;
  code: string;
  message: string;
  statusMessage: string;
  data: T;
  stack?: string;
};

type AuthUser = {
  id: string
  email: string
  lastLoginAt: string | null
}

export type LoginResponse = AuthResponse<{
  user: AuthUser
}>