"use server";

import { AxiosResponse } from "axios";

import { apiClient } from "@/lib";

export interface SelectRoleForm {
	role: "mentor" | "student";
	linkedInProfileUrl?: string;
}

export async function selectRole({ role, linkedInProfileUrl }: SelectRoleForm): Promise<number> {
	const { status } =
		role === "student"
			? await selectStudentRole()
			: await selectMentorRole(linkedInProfileUrl ?? "", "", []);

	return status;
}

async function selectStudentRole(): Promise<AxiosResponse> {
	return await apiClient.post("/students");
}

async function selectMentorRole(linkedInProfileUrl: string, biography: string, topics: string[]) {
	return await apiClient.post("/mentors", {
		linkedInProfileUrl,
		biography,
		topics,
	});
}
