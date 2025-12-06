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
	} catch {
		// Return empty array if fetch fails
	}

	return [];
}
