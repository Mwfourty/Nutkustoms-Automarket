
export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
  }
}

function getErrorMessage(data: unknown, status: number): string {
  if (typeof data === 'object' && data !== null) {
    const error = data as {
      message?: string;
      detail?: string;
      title?: string;
    };

    return (
      error.message ??
      error.detail ??
      error.title ??
      `Request failed with status ${status}.`
    );
  }

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  return `Request failed with status ${status}.`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  // The session lives in an HttpOnly cookie; this header is required by the backend's CSRF check.
  headers.set('X-Requested-With', 'XMLHttpRequest');

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();

  let data: unknown = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data, response.status),
      response.status
    );
  }

  return data as T;
}
