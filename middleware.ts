import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const user = request.cookies.get('cgsptoken')?.value;
	if (!user) return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
	matcher: ['/admin/:path*']
};
