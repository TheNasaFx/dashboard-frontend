import { useRuntimeConfig } from 'nuxt/app'
import { useCache } from './useCache'

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
}

export async function useApi<T>(endpoint: string, options: RequestInit = {}, useCacheData: boolean = true): Promise<ApiResponse<T>> {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl || 'http://localhost:8080/api/v1';
  const { get, set, has, getStats } = useCache();
  
  // Create cache key based on endpoint and options
  const cacheKey = `api_${endpoint}_${JSON.stringify(options)}`;
  
  // Check cache first (only for GET requests and when cache is enabled)
  if (useCacheData && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
    const cachedData = get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for: ${endpoint}`);
      getStats(); // Log cache statistics
      return cachedData;
    }
  }
  
  // Client-side only localStorage access
  let token: string | null = null;
  if (process.client) {
    token = localStorage.getItem('token');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log(`Fetching from API: ${endpoint}`);
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  let json: any;
  try {
    json = await res.json();
  } catch (e) {
    return { success: false, error: { code: res.status, message: 'Invalid JSON response' } };
  }

  if (res.ok && json.success) {
    const result = { success: true, data: json.data };
    
    // Cache successful responses (only for GET requests and when cache is enabled)
    if (useCacheData && options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      set(cacheKey, result);
      console.log(`Cached response for: ${endpoint}`);
    }
    
    return result;
  } else {
    return { success: false, error: json.error || { code: res.status, message: json.message || 'Unknown error' } };
  }
} 