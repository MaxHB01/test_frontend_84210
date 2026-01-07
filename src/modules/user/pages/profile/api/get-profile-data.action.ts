"use server";

import { apiClient } from "@/lib";

import type { ProfileUpdateData } from "./dtos.types";

export async function getProfileData(
	userId: string,
	isMentor: boolean
): Promise<Partial<ProfileUpdateData>> {
	try {
		if (isMentor) {
			// For mentors, get data from both endpoints
			const [mentorResponse, userResponse] = await Promise.all([
				apiClient.get(`/mentors/${userId}`),
				apiClient.get("/user/me"),
			]);

			if (mentorResponse.status === 200 && userResponse.status === 200) {
				return {
					firstName: mentorResponse.data.firstName ?? userResponse.data.firstName,
					lastName: mentorResponse.data.lastName ?? userResponse.data.lastName,
					email: userResponse.data.email,
					linkedInProfile: mentorResponse.data.linkedInProfileUrl,
					biography: mentorResponse.data.biography,
					topics: mentorResponse.data.topics ?? [],
				};
			}
		} else {
			const { status, data } = await apiClient.get("/user/me");

			if (status === 200) {
				return {
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
				};
			}
		}
	} catch {
		// Return empty data if fetch fails
	}

	return {
		firstName: "",
		lastName: "",
		email: "",
		...(isMentor && {
			linkedInProfile: "",
			biography: "",
			topics: [],
		}),
	};
}

export async function getSuggestedTopics(): Promise<string[]> {
	try {
		const { status, data } = await apiClient.get("/topics");

		if (status === 200 && Array.isArray(data)) {
			return data.filter((topic): topic is string => typeof topic === "string");
		}

		// If status is not 200, throw an error with status info
		throw new Error(
			`Failed to load suggested topics (status: ${status}). Please try again later.`
		);
	} catch (error) {
		// For expected errors (404, 401), silently return empty array
		// These are acceptable - the feature just won't have suggested topics
		if (error && typeof error === "object" && "response" in error) {
			const axiosError = error as {
				response?: { status?: number; data?: unknown };
				message?: string;
			};
			const errorStatus = axiosError.response?.status;

			if (errorStatus === 404 || errorStatus === 401) {
				return [];
			}

			// For other HTTP errors, include status in the error message
			if (errorStatus) {
				throw new Error(
					`Failed to load suggested topics (HTTP ${errorStatus}). Please try again later.`
				);
			}
		}

		// For unexpected errors (network errors, etc.), throw with original message if available
		if (error instanceof Error) {
			// Preserve the original error message if it's informative
			if (error.message.includes("status:") || error.message.includes("HTTP")) {
				throw error;
			}
			throw new Error(
				`Failed to load suggested topics: ${error.message}. Please try again later.`
			);
		}

		throw new Error("Failed to load suggested topics. Please try again later.");
	}
}
