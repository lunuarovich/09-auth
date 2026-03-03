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
  return pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/favicon.ico";
}


function cookieHeaderFromStore(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore.toString();
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
    const cookieHeader = cookieHeaderFromStore(cookieStore);

    try {
      const sessionRes = await checkSession(cookieHeader);

      const setCookie = sessionRes.headers["set-cookie"];
      if (setCookie) {
        const setCookieArr = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const c of setCookieArr) {
          res.headers.append("set-cookie", c);
        }

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
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (authed && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return res;
}