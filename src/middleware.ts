import { NextRequest, NextResponse } from "next/server";
import { validateSessionToken, COOKIE_NAME } from "@/lib/auth";

const PROTECTED_PATHS = ["/admin", "/setup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // So proteger rotas /admin e /setup
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Verificar cookie de sessao
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token || !(await validateSessionToken(token))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/setup/:path*"],
};
