"use server";

import { NextResponse, type NextRequest } from "next/server";
import * as routes from "@/routes";
import { siteConfig } from "@/lib/config";
import { NextURL } from "next/dist/server/web/next-url";
import { session, sevenDays } from "@/lib/session";

function redirectIfProtectedRoute(path: string, nextUrl: NextURL) {
  if (routes.protectedRoutes.some((route) => path.startsWith(route))) {
    const redirectUrl = new URL(routes.signInRoute, nextUrl);
    if (path !== "/") {
      redirectUrl.searchParams.set("next", path);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

function redirectIfNotPrivateRoute(path: string, nextUrl: NextURL) {
  if (
    path !== routes.privateRoute &&
    !routes.ignoredRoutes.some((route) => path.startsWith(route))
  ) {
    const redirectUrl = new URL(routes.privateRoute, nextUrl);
    if (path !== "/") {
      redirectUrl.searchParams.set("next", path);
    }
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
    if (!private_session) {
      return redirectIfNotPrivateRoute(path, nextUrl);
    }

    const { hasPrivateAccess } = await session.private.get();

    if (!hasPrivateAccess) {
      return redirectIfNotPrivateRoute(path, nextUrl);
    }

    if (path === routes.privateRoute) {
      return redirectTo(routes.signInRoute, nextUrl);
    }
  } else {
    if (path === routes.privateRoute) {
      return redirectTo(routes.signInRoute, nextUrl);
    }
  }

  if (siteConfig.maintenanceMode) {
    if (path !== routes.maintenanceRoute && path !== routes.ogRoute) {
      return redirectTo(routes.maintenanceRoute, nextUrl);
    }

    return NextResponse.next();
  } else {
    if (path === routes.maintenanceRoute) {
      return redirectTo(routes.signInRoute, nextUrl);
    }
  }

  if (path === "/") {
    return redirectTo(routes.signInRoute, nextUrl);
  }

  const user_session = cookies.get("user_session")?.value;

  if (!user_session) {
    return redirectIfProtectedRoute(path, nextUrl);
  }

  const { isSignedIn, expires } = await session.user.get();

  if (!isSignedIn) {
    return redirectIfProtectedRoute(path, nextUrl);
  }

  if (routes.authRoutes.some((route) => path.startsWith(route))) {
    return redirectTo(routes.DEFAULT_SIGNIN_REDIRECT, nextUrl);
  }

  const expiresIn = new Date(expires).getTime() - Date.now();

  if (expiresIn < sevenDays * 1000) {
    await session.user.update();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
