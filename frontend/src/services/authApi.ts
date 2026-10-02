export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  userId: string;
  username: string;
  email: string;
  role: string | number;
  token: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`/api/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const data = await res.json();
      message = data.message ?? data.detail ?? data.title ?? message;
    } catch {
      // non-JSON error body
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const register = (payload: RegisterPayload) => post('register', payload);

export const login = (payload: LoginPayload) => post<LoginResult>('login', payload);
