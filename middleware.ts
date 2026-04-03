import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

function roleAllowed(pathname: string, role?: string) {
  if (pathname.startsWith("/admin")) {
    return role === "ADMIN";
  }

  if (pathname.startsWith("/backoffice/president")) {
    return role === "PRESIDENT";
  }

  if (pathname.startsWith("/backoffice/rapporteur")) {
    return role === "RAPPORTEUR_GENERAL";
  }

  if (pathname.startsWith("/dashboard")) {
    return role === "CITIZEN" || role === "ORG";
  }

  return true;
}

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const role = request.nextauth.token?.role as string | undefined;

    if (!roleAllowed(request.nextUrl.pathname, role)) {
      const redirectUrl = new URL("/403", request.url);
      return Response.redirect(redirectUrl);
    }

    return undefined;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/backoffice/:path*", "/admin/:path*"],
};
