import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const fetchClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // For SSR inside Docker, use INTERNAL_API_URL (e.g. http://backend:8000)
  // For client-side or dev, use NEXT_PUBLIC_API_URL (e.g. http://localhost:8000)
  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // This will catch if fetchClient is inadvertently called from a client context
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // By default, revalidate data every 60 seconds.
    // In Next.js 15, fetch is not cached by default, so we use next.revalidate
    next: {
      revalidate: options.next?.revalidate ?? 60,
      ...options.next,
    },
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    console.error(`Network error fetching ${url}:`, error);
    throw error;
  }

  if (!response.ok) {
    if (response.status === 401 && endpoint.startsWith("/api/v1/admin")) {
      redirect("/admin/login");
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
};
