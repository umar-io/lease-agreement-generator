// middleware.ts  (root of project, next to app/)
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);

  const isAuthRoute     = request.nextUrl.pathname.startsWith("/auth");
  const isDashboardRoute= request.nextUrl.pathname.startsWith("/dashboard");

  // No session + trying to access dashboard → redirect to login
  if (!session && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Has session + on auth page → redirect to dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};