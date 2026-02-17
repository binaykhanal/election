import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./lib/i18n/config.js";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export async function middleware(req) {
  const url = req.nextUrl.clone();

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

    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)", 
    "/admin/:path*", 
  ],
};
