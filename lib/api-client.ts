type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface RequestOptions {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: any
  cache?: RequestCache
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const { method = "GET", headers = {}, body, cache } = options

    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache,
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, requestOptions)

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "An error occurred")
        }

        return data
      } else {
        if (!response.ok) {
          throw new Error("An error occurred")
        }

        return (await response.text()) as unknown as T
      }
    } catch (error) {
      console.error(`API request failed: ${url}`, error)
      throw error
    }
  }

  async get<T = any>(endpoint: string, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T = any>(endpoint: string, body: any, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body })
  }

  async put<T = any>(endpoint: string, body: any, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body })
  }

  async patch<T = any>(endpoint: string, body: any, options: Omit<RequestOptions, "method" | "body"> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body })
  }

  async delete<T = any>(endpoint: string, options: Omit<RequestOptions, "method"> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

export const apiClient = new ApiClient()

