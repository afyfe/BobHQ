export type ApiClient = {
  get<TResponse>(path: string): Promise<TResponse>;
  post<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse>;
};

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
}

export function createApiClient(baseUrl = apiBaseUrl): ApiClient {
  return {
    async get<TResponse>(path: string): Promise<TResponse> {
      const response = await fetch(`${baseUrl}${path}`);
      return parseResponse<TResponse>(response);
    },
    async post<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse> {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      return parseResponse<TResponse>(response);
    },
  };
}
