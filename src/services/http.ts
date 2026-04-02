import { API_BASE_URL } from "../config/apiUrl";

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

async function parseErrorMessage(response: Response): Promise<string> {
  const err = await response.json().catch(() => ({})) as { error?: string };
  return typeof err.error === "string" ? err.error : `Error ${response.status}`;
}

/**
 * Fetch JSON con cookies (sesión HttpOnly). Los componentes no deben usar esto directamente.
 */
export async function apiJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: { ...defaultHeaders, ...init.headers },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export async function apiVoid(path: string, init: RequestInit = {}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...init,
    headers: { ...defaultHeaders, ...init.headers },
  });
  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
}
