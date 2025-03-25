import { type NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// Define public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/init",
]

// Define routes that require specific roles
const roleProtectedRoutes = [
  { path: "/admin", roles: ["admin"] },
  { path: "/api/admin", roles: ["admin"] },
]

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Create Supabase client
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/"),
  )

  if (isPublicRoute) {
    return response
  }

  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login if not authenticated
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check role-based access
  const roleProtectedRoute = roleProtectedRoutes.find(
    (route) => request.nextUrl.pathname === route.path || request.nextUrl.pathname.startsWith(route.path + "/"),
  )

  if (roleProtectedRoute) {
    const userRole = session.user.user_metadata.role || "user"

    if (!roleProtectedRoute.roles.includes(userRole)) {
      // Redirect to unauthorized page if role doesn't match
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return response
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}

