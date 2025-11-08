import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const apiUrl = process.env.API_URL;

		if (!apiUrl) {
			return NextResponse.json({ error: "API URL is not configured" }, { status: 500 });
		}

		const authHeader = req.headers.get("authorization");
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (authHeader) {
			headers.Authorization = authHeader;
		}

		const res = await fetch(`${apiUrl}/api/user/role-select`, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
		});
		const contentType = res.headers.get("content-type");
		const hasContent = contentType?.includes("application/json");
		if (res.ok && !hasContent) {
			return NextResponse.json({ message: "Registration successful" }, { status: 200 });
		}
		if (hasContent) {
			const data = await res.json();
			// Handle .NET Identity error array format
			if (!res.ok && Array.isArray(data)) {
				return NextResponse.json(
					{ error: data.map(err => err.description).join(", ") },
					{ status: res.status }
				);
			}
			return NextResponse.json(data, { status: res.status });
		}
		const text = await res.text();
		return NextResponse.json(
			{ message: text || "Registration completed" },
			{ status: res.status }
		);
	} catch {
		return NextResponse.json({ error: "Failed to connect to server" }, { status: 500 });
	}
}
