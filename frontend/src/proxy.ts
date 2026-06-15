import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // If the path starts with /admin, we want to check for auth
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Let them visit login page without token
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for our token cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
