import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected Routes
const isTechnicianRoute = createRouteMatcher([
  "/staff",
  "/staff/invoices(.*)",
  "/staff/leaves(.*)",
  "/staff/schedule(.*)",
]);
const isAdminRoute = createRouteMatcher([
  "/staff",
  "/staff/services(.*)",
  "/staff/invoices(.*)",
  "/staff/quote(.*)",
  "/staff/vehicles(.*)",
  "/staff/schedule(.*)",
  "/staff/leaves(.*)",
  "/staff/staff-management(.*)",
]);
const isSuperAdminRoute = createRouteMatcher([
  "/staff(.*)",
  "/public/analytics(.*)"
]);
const isHomeRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  if (
    !auth().userId &&
    (isTechnicianRoute(req) || isAdminRoute(req) || isSuperAdminRoute(req))
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const userId = auth().userId;
  console.log(userId);
  if (typeof userId === "string") {
    const user = await clerkClient().users.getUser(userId as string);
    const role = user.publicMetadata.role;
    if (
      (role === "technician" && !isTechnicianRoute(req)) ||
      (role === "admin" && !isAdminRoute(req))
    ) {
      return NextResponse.redirect(new URL("/staff", req.url));
    }

    if (user && isHomeRoute(req)) {
      return NextResponse.redirect(new URL("/staff", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
