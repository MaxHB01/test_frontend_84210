import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { apiClient, logger } from "@/lib";

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function POST(): Promise<Response> {
	try {
		const session = await auth();

		if (!session?.accessToken) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch fresh user profile
		const { data } = await apiClient.get("/user/me");

		if (!data) {
			return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
		}

		return NextResponse.json({ success: true, user: data });
	} catch (error) {
		logger.error("[REFRESH SESSION API FAILED]", { error });
		return NextResponse.json({ error: "Failed to refresh session" }, { status: 500 });
	}
}
