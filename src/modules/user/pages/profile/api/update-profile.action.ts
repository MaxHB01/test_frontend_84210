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

function handleUpdateError(responseData: unknown): never {
	if (Array.isArray(responseData)) {
		const errorMessages = responseData
			.map((err: { description?: string }) => err.description)
			.filter((msg): msg is string => typeof msg === "string");
		throw new Error(errorMessages.join(", ") || "Failed to update profile");
	}

	if (typeof responseData === "object" && responseData !== null && "error" in responseData) {
		throw new Error(String(responseData.error) || "Failed to update profile");
	}

	throw new Error("Failed to update profile");
}

export async function updateProfileAction(
	data: ProfileUpdateData,
	userId?: string
): Promise<{ success: true }> {
	const session = await auth();

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const targetUserId = userId ?? session.user.id;
	const isMentor = session.user.roles?.includes("Mentor") ?? false;

	try {
		if (isMentor) {
			// For mentors, only update mentor-specific fields via /mentors/{id}
			const mentorUpdateBody = buildMentorUpdateRequest(data);

			const { status, data: responseData } = await apiClient.put(
				`/mentors/${targetUserId}`,
				mentorUpdateBody
			);

			if (status !== 200 && status !== 204) {
				handleUpdateError(responseData);
			}
		} else {
			throw new Error("User profile updates are not supported");
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Failed to update profile");
	}
}
