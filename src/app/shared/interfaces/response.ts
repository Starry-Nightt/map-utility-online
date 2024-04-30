export interface SuccessResponse<T> {
  success: boolean;
  data?: T;
}

export interface ErrorResponse {
  error: {
    success: boolean;
    message: string;
    statusCode: number;
  };
}

export interface LoginSuccessResponse {
  success: boolean;
  token: string;
}
