// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This is a simplified middleware that would normally check for authentication
// In a real app, you would use a JWT token, session cookie, or similar

export function middleware(request: NextRequest) {
  // For demo purposes, we'll consider a user "authenticated" if they have a specific cookie
  const isAuthenticated = request.cookies.has("auth_token");

  // Get the path from the URL
  const { pathname } = request.nextUrl;

  // Paths that should only be accessible to authenticated users
  const protectedPaths = [
    "/dashboard",
    "/dashboard/history",
    "/dashboard/settings",
    "/welcome",
  ];

  // Check if the requested path is a protected one
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/onboarding")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Otherwise continue
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/onboarding",
    "/welcome",
  ],
};
