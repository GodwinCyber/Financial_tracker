import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
//import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(
  [
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/",
    // "/accounts(.*)",
    // "/transactions",
    // "/categories",
    // "/settings",
    //"/home",
  ]
);
// const isPublicApiRoute = createRouteMatcher(
//   [
//     "/api/accounts(.*)",
//   ]
// )

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    auth().protect();
  }
  // const {userId} =auth();
  // const currentUrl = new URL(req.url);
  // const isDashboardAccess = currentUrl.pathname === "/";
  // const isApiRequest = currentUrl.pathname.startsWith("/api");

  // if (userId && isPublicRoute(req) && !isDashboardAccess) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  // //not logged in
  // if (!userId) {
  //   if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
  //     return NextResponse.redirect(new URL("/sign-in", req.url));
  //   }
  //   if (isApiRequest && !isPublicApiRoute(req)) {
  //     return NextResponse.redirect(new URL("/sign-in", req.url));
  //   }
  // }
  return NextResponse.next();
  // if (!isPublicRoute(req)) {
  //   auth().protect();
  // }
  //return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
