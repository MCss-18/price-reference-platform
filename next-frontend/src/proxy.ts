import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/panel"];

const publicRoutes = [
  "/",
];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/panel", req.nextUrl));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/panel/:path*"],
};
