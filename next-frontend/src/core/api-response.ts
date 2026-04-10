export type ApiResponse<T> = {
  data: T[];
  message?: string;
  success: boolean;
}

export type ApiSingleResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
}

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ApiError = {
  message: string;
  error?: string;
  statusCode: number;
  errors?: ValidationError[];
}

export type ValidationError = {
  field: string;
  message: string;
}