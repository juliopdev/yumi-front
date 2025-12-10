export interface ErrorDetail {
  code: string;
  message: string;
  status: number;
}

export interface ApiRequest<T> {
  success: boolean;
  path: string;
  data: T | null;
  error: ErrorDetail | null;
  timestamp: string; // ISO instant
}