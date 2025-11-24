import { NextResponse } from "next/server";
import { apiClient } from "@/lib";


export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { status, data } = await apiClient.post("/user/register", {
			body,
		});

		if (status === 200 || status === 201) {
			return NextResponse.json({ message: "Registration successful" }, { status: 200 });
		}

		if (Array.isArray(data)) {
			return NextResponse.json(
				{ error: data.map(err => err.description).join(", ") },
				{ status }
			);
		}
		return NextResponse.json(data, { status });
	} catch {
		return NextResponse.json({ error: "Failed to connect to server" }, { status: 500 });
	}
}
