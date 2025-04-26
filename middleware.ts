"use server";

import { NextResponse, type NextRequest } from "next/server";
import * as routes from "@/routes";
import { siteConfig } from "@/lib/config";
import { updateSession } from "@/lib/session";
import { verifyPrivateSession, verifyUserSession } from "@/lib/dal";
import { NextURL } from "next/dist/server/web/next-url";

function redirectIfProtectedRoute(path: string, nextUrl: NextURL) {
  if (routes.protectedRoutes.some((route) => path.startsWith(route))) {
    const redirectUrl = new URL("/login", nextUrl);
    if (path !== "/") redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

function redirectIfNotPrivateRoute(path: string, nextUrl: NextURL) {
  if (
    path !== routes.privateRoute &&
    path !== routes.ogRoute &&
    !routes.pageBgRoutes.some((route) => path.startsWith(route))
  ) {
    const redirectUrl = new URL(routes.privateRoute, nextUrl);
    if (path !== "/") redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

function redirectTo(path: string, nextUrl: NextURL) {
  return NextResponse.redirect(new URL(path, nextUrl));
}

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const path = nextUrl.pathname;

  const private_session = cookies.get("private_session")?.value;

  if (siteConfig.privateMode) {
    if (!private_session) return redirectIfNotPrivateRoute(path, nextUrl);

    const { hasPrivateAccess } = await verifyPrivateSession();

    if (!hasPrivateAccess) return redirectIfNotPrivateRoute(path, nextUrl);
  } else {
    if (path === routes.privateRoute || path === "/")
      return redirectTo("/login", nextUrl);
  }

  if (siteConfig.maintenanceMode) {
    if (path !== routes.maintenanceRoute && path !== routes.ogRoute) {
      return redirectTo(routes.maintenanceRoute, nextUrl);
    }

    return NextResponse.next();
  } else {
    if (path === routes.maintenanceRoute || path === "/") {
      return redirectTo("/login", nextUrl);
    }
  }

  const user_session = cookies.get("user_session")?.value;

  if (!user_session) return redirectIfProtectedRoute(path, nextUrl);

  const { isLoggedIn, expires } = await verifyUserSession();

  if (!isLoggedIn) return redirectIfProtectedRoute(path, nextUrl);

  if (routes.authRoutes.some((route) => path.startsWith(route)) && isLoggedIn) {
    return redirectTo(routes.DEFAULT_LOGIN_REDIRECT, nextUrl);
  }

  if (user_session && expires) {
    const expiresIn = new Date(expires).getTime() - Date.now();

    if (expiresIn < 24 * 60 * 60 * 1000) {
      await updateSession("user_session", user_session);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
