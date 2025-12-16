// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const path = req.nextUrl.pathname;

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload: any = jwt.verify(token, process.env.ACCESS_SECRET!);

    if (path.startsWith("/admin") && payload.role !== "admin")
      return NextResponse.redirect(new URL("/login", req.url));

    if (path.startsWith("/provider") && payload.role !== "provider")
      return NextResponse.redirect(new URL("/login", req.url));

    if (path.startsWith("/customer") && payload.role !== "customer")
      return NextResponse.redirect(new URL("/login", req.url));

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/provider/:path*", "/customer/:path*"],
};
