import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  
  if (!token && (req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname.startsWith('/solarsystem'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/solarsystem']
};
