"use server"

import { NextURL } from "next/dist/server/web/next-url"
import { NextResponse, type NextRequest } from "next/server"
import * as routes from "@/routes"

import { session } from "@/lib/session"
import { siteConfig } from "@/app/visiq.config"

function redirectIfProtectedRoute(nextUrl: NextURL) {
  const { pathname, search } = nextUrl

  if (routes.protectedRoutes.some((route) => pathname.startsWith(route))) {
    const redirectUrl = new URL(routes.signInRoute, nextUrl)
    if (pathname !== routes.landingRoute) {
      redirectUrl.searchParams.set("next", pathname + search)
    }
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

function redirectIfNotPrivateRoute(nextUrl: NextURL) {
  const { pathname, search } = nextUrl

  if (
    pathname !== routes.privateRoute &&
    !routes.ignoredRoutes.some((route) => pathname.startsWith(route))
  ) {
    const redirectUrl = new URL(routes.privateRoute, nextUrl)
    if (pathname !== routes.landingRoute) {
      redirectUrl.searchParams.set("next", pathname + search)
    }
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

function redirectTo(path: string, nextUrl: NextURL) {
  return NextResponse.redirect(new URL(path, nextUrl))
}

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const { pathname } = nextUrl

  if (siteConfig.privateMode) {
    const private_session = cookies.get("private_session")?.value

    if (!private_session) {
      return redirectIfNotPrivateRoute(nextUrl)
    }

    const { expires } = await session.private.get()
    const expiresIn = new Date(expires).getTime() - Date.now()

    if (!expires || expiresIn < 0) {
      await session.private.delete()

      return redirectIfNotPrivateRoute(nextUrl)
    }

    if (pathname === routes.privateRoute) {
      return redirectTo(routes.signInRoute, nextUrl)
    }
  } else {
    if (pathname === routes.privateRoute) {
      return redirectTo(routes.signInRoute, nextUrl)
    }
  }

  if (siteConfig.maintenanceMode) {
    if (pathname !== routes.maintenanceRoute && pathname !== routes.ogRoute) {
      return redirectTo(routes.maintenanceRoute, nextUrl)
    }

    return NextResponse.next()
  } else {
    if (pathname === routes.maintenanceRoute) {
      return redirectTo(routes.signInRoute, nextUrl)
    }
  }

  const user_session = cookies.get("user_session")?.value

  if (!user_session) {
    return redirectIfProtectedRoute(nextUrl)
  }

  const { userId, expires } = await session.user.get()
  const expiresIn = new Date(expires).getTime() - Date.now()

  if (!userId || !expires || expiresIn < 0) {
    await session.user.delete()

    return redirectIfProtectedRoute(nextUrl)
  }

  if (
    pathname === routes.landingRoute ||
    routes.authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return redirectTo(routes.DEFAULT_SIGNIN_REDIRECT, nextUrl)
  }

  if (expiresIn < 24 * 60 * 60 * 1000) {
    await session.user.update()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
