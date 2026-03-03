import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isAuthenticated(req: NextRequest) {
  return Boolean(req.cookies.get("accessToken")?.value || req.cookies.get("refreshToken")?.value);
}

function isPrivatePath(pathname: string) {
  return pathname.startsWith("/profile") || pathname.startsWith("/notes");
}

function isAuthPath(pathname: string) {
  return pathname === "/sign-in" || pathname === "/sign-up";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals & API
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const authed = isAuthenticated(req);

  if (!authed && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (authed && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
