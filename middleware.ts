"use server";

import { NextResponse, type NextRequest } from "next/server";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, protectedRoutes } from "@/routes";
import { siteConfig } from "@/lib/config";
import { updateSession } from "@/lib/session";
import { verifySession } from "@/lib/dal";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const path = nextUrl.pathname;

  if (siteConfig.maintenanceMode && path !== "/") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (path === "/") {
    return NextResponse.redirect(new URL("/home", nextUrl));
  }

  const session = cookies.get("session")?.value;
  const { isLoggedIn, expires } = await verifySession();

  if (!isLoggedIn) {
    const response = NextResponse.next();

    if (protectedRoutes.some((route) => path.startsWith(route))) {
      const redirectUrl = new URL("/login", nextUrl);
      redirectUrl.searchParams.set("next", path);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  if (authRoutes.some((route) => path.startsWith(route)) && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (session && expires) {
    const expiresIn = new Date(expires).getTime() - Date.now();

    if (expiresIn < 24 * 60 * 60 * 1000) {
      await updateSession(session);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
