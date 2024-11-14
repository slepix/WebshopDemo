import { config } from './config';

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.api.timeout);

  try {
    const response = await fetch(url, {
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

export async function getProducts(category?: string, sort?: string) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (sort) params.append('sort', sort);
  
  const response = await fetchWithTimeout(`${config.api.url}/products?${params}`);
  return response.json();
}

export async function getCategories() {
  const response = await fetchWithTimeout(`${config.api.url}/categories`);
  return response.json();
}

export async function getFeaturedProducts() {
  const response = await fetchWithTimeout(`${config.api.url}/featured-products`);
  return response.json();
}

export type ApiError = {
  message: string;
  isTimeout?: boolean;
  statusCode?: number;
};
