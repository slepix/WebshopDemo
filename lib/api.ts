'use client'

export class ApiClient {
  url: string;
  timeout: number;

  constructor(url: string, timeout: number = 8000) {
    this.url = url;
    this.timeout = timeout;
  }

  async fetchWithTimeout(url: string, options: RequestInit = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.url}/${url}`, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error: unknown) {  // Explicitly typing error as unknown
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;  // If it's not an Error, rethrow it
    } finally {
      clearTimeout(timeout);
    }
  }

  async getProducts(category?: string, sort?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (sort) params.append('sort', sort);

    const response = await this.fetchWithTimeout(`products?${params}`);
    return response.json();
  }

  async getCategories() {
    const response = await this.fetchWithTimeout('categories');
    return response.json();
  }

  async getFeaturedProducts() {
    const response = await this.fetchWithTimeout('featured-products');
    return response.json();
  }
}

export type ApiError = {
  message: string;
  isTimeout?: boolean;
  statusCode?: number;
};
