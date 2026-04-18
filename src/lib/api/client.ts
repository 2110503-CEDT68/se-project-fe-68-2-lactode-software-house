const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');
const API_PROXY_PREFIX = '/api-proxy';

export const TOKEN_KEY = 'hotel-booking-token';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function normalizePath(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

function resolveRequestUrl(path: string) {
  const normalizedPath = normalizePath(path);
  const isAbsoluteApiBase = /^https?:\/\//i.test(API_BASE_URL);

  // Browser calls to an absolute backend URL can fail due to CORS.
  // Route them through Next.js rewrite proxy to keep same-origin requests.
  if (typeof window !== 'undefined' && isAbsoluteApiBase) {
    return `${API_PROXY_PREFIX}${normalizedPath}`;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

export async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(resolveRequestUrl(path), {
      ...options,
      headers,
      cache: 'no-store',
    });
  } catch {
    throw new ApiError('Cannot connect to the API server. Please check backend availability.', 0);
  }

  const text = await response.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok || data.success === false) {
    const message = data.message || data.msg || 'Request failed';
    throw new ApiError(String(message), response.status);
  }

  return data as T;
}

export function formatApiMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export { API_BASE_URL };
