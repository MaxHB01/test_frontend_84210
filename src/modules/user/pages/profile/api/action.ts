"use server";

import type { Mentor } from "@/common/domain/entities/mentor";
import { apiClient } from "@/lib";

import type { MentorProfileDto } from "./dtos.types";

export async function getMentor(id: string): Promise<Mentor | null> {
	try {
		const { status, data } = await apiClient.get<MentorProfileDto>(`/mentors/${id}`);
		if (status !== 200) {
			return null;
		}

		return {
			id: data.userId,
			firstName: data.firstName,
			lastName: data.lastName,
			bio: data.biography,
			rating: 0,
			linkedInProfileUrl: data.linkedInProfileUrl,
			topics: data.topics ?? [],
		} as Mentor;
	} catch {
		return null;
	}
}
