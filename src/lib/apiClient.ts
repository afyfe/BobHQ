export type ApiClient = {
  get<TResponse>(path: string): Promise<TResponse>;
};

export type MockRouteMap = Record<string, unknown>;

export function createApiClient(baseUrl = "/api"): ApiClient {
  return {
    async get<TResponse>(path: string): Promise<TResponse> {
      const response = await fetch(`${baseUrl}${path}`);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<TResponse>;
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
  };
}
