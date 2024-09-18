import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Documentations: https://clerk.com/docs/references/nextjs/clerk-middleware

// Protected Routes
const isCustomerRoute = createRouteMatcher([
  '/customer(.*)'
])
const isTechnicianRoute = createRouteMatcher([
  // To Be Updated When More Features Arrives In SR2 and Beyond
  '/staff'
])
const isAdminRoute = createRouteMatcher([
  // To Be Updated When More Features Arrives In SR2 and Beyond
  '/staff(.*)'
])
const isSuperAdminRoute = createRouteMatcher([
  '/staff(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (!auth().userId && (isCustomerRoute(req) || isTechnicianRoute(req) || isAdminRoute(req) || isSuperAdminRoute(req))) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const userId = auth().userId
  console.log(userId);
  if (typeof userId === 'string') {
    const user = await clerkClient().users.getUser(userId as string);
    const role = user.publicMetadata.role;
    if (!role && isSuperAdminRoute(req)) {
      // Is A Customer
      return NextResponse.redirect(new URL('/', req.url));   
    }
    if ((role === 'technician' && !isTechnicianRoute(req)) || (role === 'admin' && !isAdminRoute(req))) {
      return NextResponse.redirect(new URL('/staff', req.url));
    }
  }
})

// Restrict admin routes to users with specific permissions
// export default clerkMiddleware((auth, req) => {
//   // Restrict admin routes to users with specific permissions
//   if (isProtectedRoute(req)) {
//     auth().protect((has) => {
//       return (
//         has({ permission: 'org:sys_memberships:manage' }) ||
//         has({ permission: 'org:sys_domains_manage' })
//       )
//     })
//   }
// })

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};