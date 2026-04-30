import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const start = performance.now();
  const res = NextResponse.next();

  const duration = Math.round(performance.now() - start);
  // NOTE: console.log gets swallowed in production by Vercel.
  console.log(JSON.stringify({
    method: req.method,
    path: req.nextUrl.pathname,
    status: res.status,
    duration_ms: duration,
    timestamp: new Date().toISOString(),
  }));

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
