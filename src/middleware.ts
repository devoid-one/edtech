import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
  if (!isAuthPage && !isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/login", req.url));
  }
  if (!isAuthPage && !isLoggedIn && req.nextUrl.pathname.startsWith("/courses/")) {
    return Response.redirect(new URL("/login", req.url));
  }
  return undefined;
});

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/login", "/register"],
};
