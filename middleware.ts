import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Documentations: https://clerk.com/docs/references/nextjs/clerk-middleware

// Add protected routes here
// const isProtectedRoute = createRouteMatcher(['/testPage(.*)'])
const isProtectedRoute = createRouteMatcher([])

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

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};