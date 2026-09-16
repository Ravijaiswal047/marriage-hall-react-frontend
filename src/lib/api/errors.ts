export interface BackendValidationErrorMap {
  [fieldName: string]: string;
}

export interface BackendErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: BackendValidationErrorMap | null;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly path: string;
  public readonly validationErrors?: BackendValidationErrorMap | null;

  constructor(errorRes: BackendErrorResponse) {
    super(errorRes.message || 'An unexpected error occurred');
    this.name = 'ApiError';
    this.status = errorRes.status || 500;
    this.code = errorRes.error || 'INTERNAL_SERVER_ERROR';
    this.path = errorRes.path || '';
    this.validationErrors = errorRes.validationErrors || null;
  }
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as {
      response?: { data?: BackendErrorResponse; status?: number };
    };
    if (
      axiosError.response?.data &&
      typeof axiosError.response.data === 'object'
    ) {
      return new ApiError(axiosError.response.data);
    }
  }

  return new ApiError({
    timestamp: new Date().toISOString(),
    status: 500,
    error: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Network request failed',
    path: '',
    validationErrors: null,
  });
}

