export interface ApiErrorResponse {
  code: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
