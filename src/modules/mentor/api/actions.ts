"use server";

import type { Mentor } from "@/common/domain/entities/mentor";
import { apiClient } from "@/lib";

import type { MentorDto } from "./dtos.types";

export async function getMentors(topic?: string): Promise<Mentor[]> {
	var { status, data } = await apiClient.get<MentorDto[]>("/mentors", {
		params: {
			topic,
		},
	});

	if (status !== 200 || !Array.isArray(data)) {
		return [];
	}

	// TODO add rating here
	return data.map(
		dto =>
			({
				id: dto.userId,
				firstName: dto.firstName,
				lastName: dto.lastName,
				bio: dto.biography,
				rating: 0,
				topics: dto.topics,
				linkedInProfileUrl: dto.linkedInProfileUrl,
			}) as Mentor
	);
}
