export type ApiClient = {
  get<TResponse>(path: string): Promise<TResponse>;
  post<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse>;
};

export type MockRouteMap = Record<string, unknown>;

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

export function createMockApiClient(routes: MockRouteMap): ApiClient {
  return {
    async get<TResponse>(path: string): Promise<TResponse> {
      if (!(path in routes)) {
        throw new Error(`Mock API route not found: ${path}`);
      }

      return structuredClone(routes[path]) as TResponse;
    },
    async post<TResponse, TBody = unknown>(path: string, body: TBody): Promise<TResponse> {
      void body;

      if (!(path in routes)) {
        throw new Error(`Mock API route not found: ${path}`);
      }

      return structuredClone(routes[path]) as TResponse;
    },
  };
}
