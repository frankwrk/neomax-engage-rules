import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for an admin route
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

  // Check if the request is for an authenticated route
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/competitions") ||
    isAdminRoute

  // Check if the request is for an auth page (login/signup)
  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in") || req.nextUrl.pathname.startsWith("/sign-up")

  // If user is signed in and tries to access auth page, redirect to dashboard
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If user is not signed in and tries to access authenticated route, redirect to login
  if (!session && isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  // If user is signed in but tries to access admin route without admin rights
  // This would require checking admin status in the database
  if (isAdminRoute && session) {
    // Here you would check if the user has admin rights
    // For now, we'll just let them through and handle it in the page
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/competitions/:path*", "/admin/:path*", "/sign-in", "/sign-up"],
}

