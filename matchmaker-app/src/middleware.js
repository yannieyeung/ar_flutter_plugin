import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/auth/signup', '/', '/api/auth'];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get auth token from cookie
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken) {
    console.log('🚫 Middleware: No auth token found, redirecting to signin', { pathname });
    // Redirect to sign in if no token
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  console.log('✅ Middleware: Auth token found, allowing access', { pathname });
  
  // For protected routes, we'll let the page components handle 
  // the authentication verification using client-side auth context
  // This avoids Edge Runtime limitations with Firebase Admin
  
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};