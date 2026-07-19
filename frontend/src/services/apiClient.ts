type ViteEnvironment = {
  VITE_API_BASE_URL?: string;
};

type ViteImportMeta = ImportMeta & {
  env?: ViteEnvironment;
};

const viteEnvironment = (import.meta as ViteImportMeta).env;

const API_BASE_URL =
  viteEnvironment?.VITE_API_BASE_URL ?? "http://localhost:5000/api";

interface ApiErrorResponse {
  message?: string;
  title?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(
    `${API_BASE_URL}${normalizedEndpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    let errorMessage =
      "Something went wrong while connecting to the server.";

    try {
      const errorData =
        (await response.json()) as ApiErrorResponse;

      errorMessage =
        errorData.message ??
        errorData.title ??
        errorMessage;
    } catch {
      // The server did not return a JSON error response.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}