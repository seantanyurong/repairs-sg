import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected Routes
const isCustomerRoute = createRouteMatcher(["/customer(.*)"]);
const isTechnicianRoute = createRouteMatcher([
  // To Be Updated When More Features Arrives In SR2 and Beyond
  "/staff",
]);
const isAdminRoute = createRouteMatcher([
  // To Be Updated When More Features Arrives In SR2 and Beyond
  "/staff(.*)",
]);
const isSuperAdminRoute = createRouteMatcher(["/staff(.*)"]);
const isHomeRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  if (
    !auth().userId &&
    (isCustomerRoute(req) ||
      isTechnicianRoute(req) ||
      isAdminRoute(req) ||
      isSuperAdminRoute(req))
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const userId = auth().userId;
  console.log(userId);
  if (typeof userId === "string") {
    const user = await clerkClient().users.getUser(userId as string);
    const role = user.publicMetadata.role;
    if (!role && isSuperAdminRoute(req)) {
      // Is A Customer
      return NextResponse.redirect(new URL("/customer", req.url));
    }
    if (role && isCustomerRoute(req)) {
      // Is A Staff
      return NextResponse.redirect(new URL("/staff", req.url));
    }
    if (
      (role === "technician" && !isTechnicianRoute(req)) ||
      (role === "admin" && !isAdminRoute(req))
    ) {
      return NextResponse.redirect(new URL("/staff", req.url));
    }

    if (isHomeRoute(req)) {
      if (!role) {
        return NextResponse.redirect(new URL("/customer", req.url));
      } else {
        return NextResponse.redirect(new URL("/staff", req.url));
      }
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
