// /middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const role = req.cookies.get("role")?.value; // will be undefined if no cookie

  // define admin-only paths (exact paths or prefixes)
  const adminPaths = [
    "/dashboard/home",
    "/signup",
    "/dashboard/profile",
    "/dashboard/notifications",
    "/dashboard/messages",
    "/dashboard/total-stocks-value",
    "/dashboard/total-stocks-profit",
    "/dashboard/sellers",
    "/dashboard/analytics",
    "/dashboard/employees",
    "/dashboard/settings"
  ];

  const isAdminPath = adminPaths.some(p => req.nextUrl.pathname.startsWith(p));

  if (isAdminPath) {
    // if no role cookie or not admin -> redirect to unauthorized or login
    if (!role || role !== "admin") {
      url.pathname = "/unauthorized"; // create a simple unauthorized page
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware to matching paths (optional more specific)
export const config = {
  matcher: [
    "/dashboard/:path*"
  ],
};
