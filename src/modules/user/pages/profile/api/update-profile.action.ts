"use server";

import { auth } from "@/auth";
import { apiClient } from "@/lib";

import type { MentorUpdateRequest, ProfileUpdateData } from "./dtos.types";

function buildMentorUpdateRequest(data: ProfileUpdateData): MentorUpdateRequest {
	const request: MentorUpdateRequest = {};

	if (data.linkedInProfile !== undefined) {
		request.linkedInProfileUrl = data.linkedInProfile;
	}
	if (data.biography !== undefined) {
		request.biography = data.biography;
	}
	if (data.topics !== undefined) {
		request.topics = data.topics;
	}

	return request;
}

export async function updateProfileAction(
	data: ProfileUpdateData,
	userId?: string
): Promise<{ success: true } | { success: false; error: string }> {
	const session = await auth();

	if (!session?.user?.id) {
		return { success: false, error: "Unauthorized" };
	}

	const targetUserId = userId ?? session.user.id;
	const isMentor = session.user.roles?.includes("Mentor") ?? false;

	try {
		if (isMentor) {
			// For mentors, only update mentor-specific fields via /mentors/{id}
			const mentorUpdateBody = buildMentorUpdateRequest(data);

			// Ensure we have at least one field to update
			if (Object.keys(mentorUpdateBody).length === 0) {
				return { success: false, error: "No mentor fields to update" };
			}

			const { status, data: responseData } = await apiClient.put(
				`/mentors/${targetUserId}`,
				mentorUpdateBody
			);

			if (status !== 200 && status !== 204) {
				const errorMessage = extractErrorMessage(responseData);
				return { success: false, error: errorMessage };
			}
		} else {
			// For non-mentors, update user info (firstName, lastName, email)
			const userUpdateBody: {
				firstName?: string;
				lastName?: string;
				email?: string;
			} = {};

			if (data.firstName !== undefined) {
				userUpdateBody.firstName = data.firstName;
			}
			if (data.lastName !== undefined) {
				userUpdateBody.lastName = data.lastName;
			}
			if (data.email !== undefined) {
				userUpdateBody.email = data.email;
			}

			// Ensure we have at least one field to update
			if (Object.keys(userUpdateBody).length === 0) {
				return { success: false, error: "No user fields to update" };
			}

			// Update user info via /user/me endpoint (if available) or create a user update endpoint
			// For now, we'll try PUT /user/me
			try {
				const { status, data: responseData } = await apiClient.put(
					"/user/me",
					userUpdateBody
				);

				if (status !== 200 && status !== 204) {
					const errorMessage = extractErrorMessage(responseData);
					return { success: false, error: errorMessage };
				}
			} catch (error) {
				// If /user/me doesn't support PUT, we might need a different endpoint
				const errorMessage =
					error instanceof Error ? error.message : "Failed to update user profile";
				return { success: false, error: errorMessage };
			}
		}

		return { success: true };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
		return { success: false, error: errorMessage };
	}
}

function extractErrorMessage(responseData: unknown): string {
	if (Array.isArray(responseData)) {
		const errorMessages = responseData
			.map((err: { description?: string }) => err.description)
			.filter((msg): msg is string => typeof msg === "string");
		return errorMessages.join(", ") || "Failed to update profile";
	}

	if (typeof responseData === "object" && responseData !== null && "error" in responseData) {
		return String(responseData.error) || "Failed to update profile";
	}

	return "Failed to update profile";
}
