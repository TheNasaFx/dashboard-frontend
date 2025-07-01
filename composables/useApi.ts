import { useRuntimeConfig } from 'nuxt/app'

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    message: string;
  };
}

export async function useApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiUrl || 'http://localhost:8080/api/v1';
  
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
    return { success: true, data: json.data };
  } else {
    return { success: false, error: json.error || { code: res.status, message: json.message || 'Unknown error' } };
  }
} 