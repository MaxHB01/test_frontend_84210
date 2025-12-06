import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { apiClient } from "@/lib";

export async function PUT(req: Request): Promise<Response> {
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

		// Check if user is a mentor based on roles
		const isMentor = session.user?.roles?.includes("Mentor") ?? false;

		let endpoint: string;
		let requestBody: Record<string, unknown>;

		if (isMentor) {
			// For mentors, only update mentor-specific fields via /mentors/{id}
			endpoint = `/mentors/${session.user?.id}`;
			requestBody = {};

			if (body.linkedInProfile !== undefined) {
				requestBody.linkedInProfileUrl = body.linkedInProfile;
			}
			if (body.biography !== undefined) {
				requestBody.biography = body.biography;
			}
			if (body.topics !== undefined) {
				requestBody.topics = body.topics;
			}
		} else {
			// For regular users, update user fields via /user/me
			endpoint = `/user/me`;
			requestBody = {
				firstName: body.firstName,
				lastName: body.lastName,
				email: body.email,
			};
		}

		const { status, data } = await apiClient.put(endpoint, {
			body: requestBody,
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

		return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to connect to server" }, { status: 500 });
	}
}
