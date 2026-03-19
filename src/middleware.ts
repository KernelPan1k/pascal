import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// In-memory rate limiter: max 5 login attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Rate limit login form submissions
  if (pathname === "/api/auth/callback/credentials" && req.method === "POST") {
    const ip = getIp(req);
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Trop de tentatives. Réessayez dans 15 minutes." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    return NextResponse.next();
  }

  // Allow login page, redirect to dashboard if already authenticated
  if (pathname === "/panneau/login") {
    if (req.auth) {
      return NextResponse.redirect(new URL("/panneau", req.url));
    }
    return NextResponse.next();
  }

  // Protect /panneau routes
  if (pathname.startsWith("/panneau")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/panneau/login", req.url));
    }

    const adminOnlyRoutes = ["/panneau/users", "/panneau/settings"];
    if (adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
      if (req.auth.user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/panneau", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/panneau/:path*", "/api/auth/callback/credentials"],
};
