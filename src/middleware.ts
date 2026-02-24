import { NextRequest, NextResponse } from "next/server";
import { validateSessionToken, COOKIE_NAME } from "@/lib/auth";

// Paginas que exigem login (redireciona para /login)
const PROTECTED_PAGES = ["/admin", "/setup"];

// APIs que exigem login para escrita (retorna 401 JSON)
const PROTECTED_API_PATHS = ["/api/partners", "/api/conteudo", "/api/ai"];
const WRITE_METHODS = ["POST", "PUT", "DELETE", "PATCH"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));
  const isProtectedApi =
    PROTECTED_API_PATHS.some((p) => pathname.startsWith(p)) &&
    WRITE_METHODS.includes(method);

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next();

  // Verificar cookie de sessao
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isValid = token ? await validateSessionToken(token) : false;

  if (!isValid) {
    // APIs retornam JSON 401; paginas redirecionam para login
    if (isProtectedApi) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/setup/:path*",
    "/api/partners/:path*",
    "/api/conteudo/:path*",
    "/api/ai/:path*",
  ],
};
