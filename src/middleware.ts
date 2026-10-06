import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/products(.*)',
  '/sales(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const isDemoParam = request.nextUrl.searchParams.get('demo') === 'true';
  const hasDemoCookie = request.cookies.get('traders_demo_session')?.value === 'true';

  if (isProtectedRoute(request)) {
    // If user has demo session or requested demo, grant instant access
    if (isDemoParam || hasDemoCookie) {
      const response = NextResponse.next();
      if (isDemoParam && !hasDemoCookie) {
        response.cookies.set('traders_demo_session', 'true', {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
          sameSite: 'lax',
        });
      }
      return response;
    }

    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};