import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";
import { isUserOnboarded } from "@/app/lib/profile-service";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. PROTECTED ROUTES LOGIC
  // If no user and trying to access /dashboard or /settings, redirect to login
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/settings") ||
      request.nextUrl.pathname.startsWith("/documents"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. LOGGED-IN REDIRECT
  // If user is logged in and tries to go to /login, send them to dashboard
  if (user && request.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 4. ONBOARDING CHECK
  // If user is trying to access dashboard, settings, or documents, check if they've completed onboarding
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/settings") ||
      request.nextUrl.pathname.startsWith("/documents") ||
      request.nextUrl.pathname.startsWith("/generate"))
  ) {
    try {
      const onboarded = await isUserOnboarded(user.id);

      // If not onboarded, redirect to onboarding
      if (!onboarded) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    } catch (error) {
      console.error("Middleware onboarding check error:", error);
      // On error, allow access (fail open) to prevent lockout
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
