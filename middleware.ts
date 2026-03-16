import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow login page
  if (pathname === "/panneau/login") {
    if (req.auth) {
      return NextResponse.redirect(new URL("/panneau", req.url));
    }
    return NextResponse.next();
  }

  // Protect all /panneau/* routes
  if (pathname.startsWith("/panneau")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/panneau/login", req.url));
    }

    // Admin-only routes
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
  matcher: ["/panneau/:path*"],
};
