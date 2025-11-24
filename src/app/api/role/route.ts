import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { apiClient } from "@/lib";

export async function POST(req: Request): Promise<Response> {
	try {
		const body = await req.json();
		const session = await auth();

		if (!session?.accessToken) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const apiUrl = process.env.API_URL;

		if (!apiUrl) {
			return NextResponse.json({ error: "API URL is not configured" }, { status: 500 });
		}

		const { status, data } = await apiClient.post(`/user/role-select`, {
			body,
		});

		if (status <= 200 && status >= 205) {
			if (Array.isArray(data)) {
				return NextResponse.json(
					{ error: data.map(err => err.description).join(", ") },
					{ status }
				);
			}

			return NextResponse.json({ error: "Unexpected Exception" }, { status });
		}

		return NextResponse.json({ message: "Registration successful" }, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to connect to server" }, { status: 500 });
	}
}
