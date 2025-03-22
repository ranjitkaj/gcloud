import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData;
    let errorText;
    
    try {
      // Try to parse as JSON first
      errorData = await res.json();
      errorText = errorData.message || errorData.error || res.statusText;
    } catch (e) {
      // If it's not JSON, get as text
      try {
        errorText = await res.text() || res.statusText;
      } catch (e) {
        errorText = res.statusText;
      }
    }
    
    const error = new Error(`${res.status}: ${errorText}`);
    // Add response to the error object for handling specific HTTP status codes
    (error as any).response = res;
    (error as any).status = res.status;
    (error as any).data = errorData;
    throw error;
  }
}

export async function apiRequest(
  url: string,
  method: string = 'GET',
  data?: any | undefined,
): Promise<Response> {
  console.log(`API Request: ${url} ${method}`);
  
  try {
    // Fix: Ensure method is properly formatted
    const validMethod = method.toUpperCase();
    
    const options: RequestInit = {
      method: validMethod,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {})
      },
      credentials: "include",
    };
    
    // Only include body for POST, PUT, PATCH methods
    if (data && ['POST', 'PUT', 'PATCH'].includes(validMethod)) {
      options.body = JSON.stringify(data);
    }
    
    const res = await fetch(url, options);
    
    if (res.status === 401) {
      console.warn('Authentication required for operation:', url);
      const error = new Error('Authentication required');
      (error as any).response = res;
      (error as any).status = 401;
      throw error;
    }
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API Request Error (${url} ${method}):`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
