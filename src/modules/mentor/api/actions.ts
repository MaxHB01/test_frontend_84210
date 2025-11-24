"use server";

import type { Mentor } from "@/common/domain/entities/mentor";
import { apiClient } from "@/lib";

import type { MentorDto } from "./dtos.types";

export async function getMentors(topic?: string): Promise<Mentor[]> {
	var { status, data } = await apiClient.get<MentorDto[]>("/mentors/search", {
		params: {
			topic,
		},
	});

	if (status !== 200 || !Array.isArray(data)) {
		return [];
	}

	// TODO add rating and topics here.
	return data.map(
		dto =>
			({
				id: dto.id,
				firstName: dto.firstName,
				lastName: dto.lastName,
				bio: dto.biography,
				rating: 0,
				topics: [],
			}) as Mentor
	);
}
