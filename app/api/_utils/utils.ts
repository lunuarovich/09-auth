import { parse } from 'cookie';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const AUTH_COOKIE_NAMES = ['accessToken', 'refreshToken', 'sessionId'] as const;

type CookieStore = {
  set: (name: string, value: string, options?: Partial<ResponseCookie>) => void;
  delete: (name: string) => void;
};

function getCookieOptions(
  parsed: Record<string, string | undefined>
): Partial<ResponseCookie> {
  const maxAge = Number(parsed['Max-Age']);
  const sameSite = parsed.SameSite?.toLowerCase();
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
    path: parsed.Path || '/',
    maxAge: Number.isFinite(maxAge) ? maxAge : undefined,
    httpOnly: true,
    secure: isProduction,
    sameSite:
      isProduction &&
      (sameSite === 'none' || sameSite === 'strict' || sameSite === 'lax')
        ? sameSite
        : 'lax',
  };
}

export function setAuthCookies(
  cookieStore: CookieStore,
  setCookie: string | string[] | undefined
): boolean {
  if (!setCookie) return false;

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
  let didSetCookie = false;

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);
    const options = getCookieOptions(parsed);

    for (const name of AUTH_COOKIE_NAMES) {
      if (parsed[name]) {
        cookieStore.set(name, parsed[name], options);
        didSetCookie = true;
      }
    }
  }

  return didSetCookie;
}

export function clearAuthCookies(cookieStore: CookieStore): void {
  for (const name of AUTH_COOKIE_NAMES) {
    cookieStore.delete(name);
  }
}

export function logErrorResponse(errorObj: unknown): void {
  const green = '\x1b[32m';
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';

  console.log(`${green}> ${yellow}Error Response Data:${reset}`);
  console.dir(errorObj, { depth: null, colors: true });
}
