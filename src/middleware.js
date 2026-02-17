// src/middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./lib/i18n/config.js";

// 1️⃣ next-intl middleware for public pages
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // 2️⃣ Admin routes - auth protected
  if (url.pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isLoggedIn = !!token;

    if (!isLoggedIn && !url.pathname.includes("/login")) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (isLoggedIn && url.pathname.includes("/login")) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }

    // Admin route is fine, skip next-intl
    return NextResponse.next();
  }

  // 3️⃣ Public routes - locale prefix applied
  return intlMiddleware(req);
}

export const config = {
  // Apply to all routes except API/_next/static files
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)", // public pages
    "/admin/:path*", // admin pages
  ],
};
