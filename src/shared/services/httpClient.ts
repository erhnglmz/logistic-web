import { env } from '@/app/config/env';
import type { ApiErrorResponse } from '@/shared/types/api.types';

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

async function parseError(response: Response): Promise<HttpError> {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    return new HttpError(body.message, response.status, body.code, body.errors);
  } catch {
    return new HttpError('Request failed.', response.status);
  }
}

export async function httpClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
