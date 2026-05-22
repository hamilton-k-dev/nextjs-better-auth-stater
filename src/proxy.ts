import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/reset-password",
  "/verify-email",
  "/api/demo",
];

const AUTH_ROUTES = ["/login", "/register"];

const ADMIN_ROUTES = ["/dashboard/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session;

  const matchesRoute = (routes: string[]) =>
    routes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && matchesRoute(AUTH_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow public routes
  const isPublic = matchesRoute(PUBLIC_ROUTES);

  // Redirect unauthenticated users
  if (!isAuthenticated && !isPublic) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (
    isAuthenticated &&
    ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    try {
      const sessionRes = await fetch(
        new URL("/api/auth/get-session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") ?? "",
          },
        },
      );

      const session = await sessionRes.json();

      if (session?.user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
