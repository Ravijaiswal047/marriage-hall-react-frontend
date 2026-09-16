import { describe, it, expect } from 'vitest';
import { ApiError, parseApiError } from './errors';

describe('ApiError & parseApiError', () => {
  it('correctly constructs ApiError from BackendErrorResponse DTO', () => {
    const error = new ApiError({
      timestamp: '2026-09-12T12:00:00',
      status: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      path: '/api/auth/signup',
      validationErrors: { email: 'Email must be valid' },
    });

    expect(error.status).toBe(400);
    expect(error.code).toBe('Bad Request');
    expect(error.message).toBe('Validation failed');
    expect(error.validationErrors).toEqual({ email: 'Email must be valid' });
  });

  it('parses Axios response error data into ApiError', () => {
    const mockAxiosError = {
      response: {
        status: 401,
        data: {
          timestamp: '2026-09-12T12:00:00',
          status: 401,
          error: 'Unauthorized',
          message: 'Invalid email or password',
          path: '/api/auth/login',
        },
      },
    };

    const parsed = parseApiError(mockAxiosError);
    expect(parsed.status).toBe(401);
    expect(parsed.message).toBe('Invalid email or password');
  });

  it('handles generic unknown errors gracefully', () => {
    const parsed = parseApiError(new Error('Network failure'));
    expect(parsed.status).toBe(500);
    expect(parsed.message).toBe('Network failure');
  });
});

