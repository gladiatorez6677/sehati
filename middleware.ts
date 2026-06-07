import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redirect based on role
    if (path.startsWith("/masyarakat") && token?.role !== "MASYARAKAT") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (path.startsWith("/perawat") && token?.role !== "PERAWAT") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/masyarakat/:path*", "/perawat/:path*"],
}