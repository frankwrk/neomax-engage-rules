import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create Supabase client with properly formatted URL
  const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseUrl = rawSupabaseUrl.startsWith('http') ? 
    rawSupabaseUrl : 
    `https://${rawSupabaseUrl}`
  
  try {
    // Create the middleware client with properly formatted URL
    const supabase = createMiddlewareClient({ 
      req, 
      res,
      options: {
        supabaseUrl: supabaseUrl,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      }
    })

    // Get session data
    const { data: { session } } = await supabase.auth.getSession()

    // Check if the request is for an admin route
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    // Check if the request is for an authenticated route
    const isAuthRoute =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/competitions") ||
      isAdminRoute

    // Check if the request is for an auth page (login/signup)
    // Need to match both direct and route group paths
    const isAuthPage = 
      req.nextUrl.pathname === "/sign-in" || 
      req.nextUrl.pathname === "/sign-up"

    // If user is signed in and tries to access auth page, redirect to dashboard
    if (session && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // If user is not signed in and tries to access authenticated route, redirect to login
    if (!session && isAuthRoute) {
      // Create sign-in URL with redirect parameter
      const signInUrl = new URL("/sign-in", req.url)
      
      // Add the requested URL as a redirect_to query parameter
      signInUrl.searchParams.set('redirect_to', req.nextUrl.pathname + req.nextUrl.search)
      
      return NextResponse.redirect(signInUrl)
    }

    // If user is signed in but tries to access admin route without admin rights
    if (isAdminRoute && session) {
      // Check if the user has admin role
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single()
      
      // If there's an error or the user is not an admin, redirect to the dashboard
      if (error || !userData || userData.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
    
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return res
  }
}

export const config = {
  matcher: [
    // Protected routes that require authentication
    "/dashboard/:path*", 
    "/profile/:path*", 
    "/competitions/:path*", 
    "/admin/:path*", 
    
    // Auth pages (for redirecting authenticated users away from these pages)
    "/sign-in", 
    "/sign-up"
  ]
}

