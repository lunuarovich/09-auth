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

function redirectWithCookies(
  req: NextRequest,
  toPathname: string,
  baseResponseWithCookies: NextResponse
) {
  const url = req.nextUrl.clone();
  url.pathname = toPathname;

  const redirectRes = NextResponse.redirect(url);

  const setCookie = baseResponseWithCookies.headers.getSetCookie?.();

  if (setCookie && setCookie.length > 0) {
    setCookie.forEach((c) => redirectRes.headers.append("set-cookie", c));
  } else {
    const raw = baseResponseWithCookies.headers.get("set-cookie");
    if (raw) redirectRes.headers.append("set-cookie", raw);
  }

  return redirectRes;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let authed = Boolean(accessToken);

  const res = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const cookieHeader = cookieStore.toString();
      const sessionRes = await checkSession(cookieHeader);

      const setCookieHeader = sessionRes.headers["set-cookie"];
      if (setCookieHeader) {
        const setCookieArr = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        setCookieArr.forEach((c) => res.headers.append("set-cookie", c));

        if (setCookieArr.some((c) => c.startsWith("accessToken="))) {
          authed = true;
        }
      }

      if (sessionRes.data?.success) {
        authed = true;
      }
    } catch {
      authed = false;
    }
  }

  if (!authed && isPrivatePath(pathname)) {
    return redirectWithCookies(req, "/sign-in", res);
  }

  if (authed && isAuthPath(pathname)) {
    return redirectWithCookies(req, "/", res);
  }

  return res;
}