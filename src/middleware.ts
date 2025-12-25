import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
   const path = request.nextUrl.pathname

   const isPublicPath = path === '/login' || path === '/signup' || path === '/' || path === '/verifyemail' || path.startsWith('/api/users/login') || path.startsWith('/api/users/signup') || path.startsWith('/_next') || path.startsWith('/static') || path === '/favicon.ico';

   const token = request.cookies.get('token')?.value

   // If user is logged in and trying to access public auth pages, redirect to profile
   if ((path === '/login' || path === '/signup') && token) {
       return NextResponse.redirect(new URL('/profile', request.nextUrl))
   }

   // If user is not logged in and trying to access protected pages, redirect to login
   if (!isPublicPath && !token) {
       return NextResponse.redirect(new URL('/login', request.nextUrl))
   }

   // Allow the request to continue
   return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/profile/:path*',
        '/login',
        '/signup',
        '/verifyemail',
    ]
}