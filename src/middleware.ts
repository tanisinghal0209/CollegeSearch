import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isCompare = nextUrl.pathname.startsWith("/compare");

  if ((isDashboard || isCompare) && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return Response.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/compare/:path*"],
};
