export class HttpError extends Error {
  readonly response;

  constructor(response: Response) {
    super(`HTTP Error: ${String(response.status)} ${response.statusText}`);
    this.response = response;
  }
}

const request = async <T>(path: string, options: RequestInit): Promise<T> => {
  const baseUrl = "http://localhost:3000";
  const url = new URL(path, baseUrl);

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new HttpError(response);
  }

  if (
    response.status === 204 ||
    response.headers.get("Content-Length") === "0"
  ) {
    return undefined as T;
  }

  return response.json() as T;
};

const ApiClient = {
  get<T>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...options,
      method: "GET",
    });
  },
  post<T>(path: string, body: unknown, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers);
    headers.set("Content-Type", "application/json");

    return request<T>(path, {
      ...options,
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  },
  put<T>(path: string, body: unknown, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers);
    headers.set("Content-Type", "application/json");

    return request<T>(path, {
      ...options,
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
  },
  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...options,
      method: "DELETE",
    });
  },
};

export default ApiClient;
