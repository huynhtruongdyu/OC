export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string | null;
  errors: Record<string, string[]> | null;
  pagination: PaginationInfo | null;
};

export type PaginationInfo = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

