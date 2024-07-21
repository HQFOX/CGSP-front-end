import { NextResponse, type NextRequest } from "next/server";
 
export function middleware(request: NextRequest) {
	const user = request.cookies.get("token")?.value;
	if(!user)
		return NextResponse.redirect(new URL("/login", request.url));
}
 
export const config = {
	matcher: ["/admin/:path*"],
};