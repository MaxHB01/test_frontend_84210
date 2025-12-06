"use server";

import type { Mentor } from "@/common/domain/entities/mentor";
import { apiClient } from "@/lib";

import type { MentorDto } from "./dtos.types";

export async function getMentor(id: string): Promise<Mentor | null> {
	try {
		const { status, data } = await apiClient.get<MentorDto>(`/api/user/${id}`);

		if (status !== 200) {
			return null;
		}

		// TODO add rating and topics here.
		return {
			id,
			firstName: data.firstName,
			lastName: data.lastName,
			bio: data.biography,
			rating: 0,
			linkedInProfileUrl: data.linkedInProfileUrl,
			topics: ["software", "civil engineering", "backend"],
		} as Mentor;
	} catch {
		return null;
	}
}
