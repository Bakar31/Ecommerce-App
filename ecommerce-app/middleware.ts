import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/user/sign-in' || path === '/user/sign-up'
    const token = request.cookies.get('userToken')?.value || ''

    if (isPublicPath && token){
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if (!isPublicPath && !token){
        return NextResponse.redirect(new URL('/user/sign-up', request.nextUrl))
    }
//   return NextResponse.redirect(new URL('/', request.url))
}
 

export const config = {
  matcher: [
    '/',
    '/user/sign-in',
    '/user/sign-up',
    '/add-products',
    '/edit-product',
  ]
}