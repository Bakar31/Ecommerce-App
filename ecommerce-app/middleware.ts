import { NextResponse, NextRequest } from 'next/server';
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/user/sign-in' || path === '/user/sign-up';
  const token = request.cookies.get('userToken')?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/user/sign-up', request.nextUrl));
  }

  if (!isPublicPath && token) {
    try {
      const {payload} = await jose.jwtVerify(token, new TextEncoder().encode('bakar31'));
      const userRole =  payload.role;

      if (!userRole) {
        return NextResponse.redirect(new URL('/user/sign-up', request.nextUrl));
      }

      if (userRole === 'ADMIN') {

      } else {
        if (path === '/add-products' || path === '/edit-product') {
          return NextResponse.redirect(new URL('/', request.nextUrl));
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return NextResponse.redirect(new URL('/user/sign-up', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/sign-in',
    '/user/sign-up',
    '/add-products',
    '/edit-product',
  ],
};
