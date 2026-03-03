import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";

function isPrivatePath(pathname: string) {
  return pathname.startsWith("/profile") || pathname.startsWith("/notes");
}

function isAuthPath(pathname: string) {
  return pathname === "/sign-in" || pathname === "/sign-up";
}

function shouldSkip(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const cookieHeader = cookieStore.toString();

      const sessionResponse = await checkSession(cookieHeader);

      const setCookie = sessionResponse.headers["set-cookie"];

      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        cookiesArray.forEach((cookie) => {
          response.headers.append("set-cookie", cookie);
        });

        if (cookiesArray.some((cookie) => cookie.startsWith("accessToken="))) {
          isAuthenticated = true;
        }
      }

      if (sessionResponse.data?.success) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}