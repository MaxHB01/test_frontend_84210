import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

export async function middleware(req: NextRequest): Promise<NextResponse | void> {
	const { pathname } = req.nextUrl;

	if (
		pathname.startsWith("/auth/login") ||
		pathname.startsWith("/auth/register") ||
		pathname.startsWith("/api/auth")
	) {
		return NextResponse.next();
	}

	const session = await auth();

	if (!session?.user) {
		return NextResponse.redirect(new URL("/auth/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!.*\\..*).*)"],
};
