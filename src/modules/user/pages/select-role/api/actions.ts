"use server";

import type { AxiosResponse } from "axios";

import { auth } from "@/auth";
import { apiClient, logger } from "@/lib";

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

export async function refreshUserSession(): Promise<{ success: boolean; roles?: string[] }> {
	try {
		const session = await auth();
		if (!session?.accessToken) {
			return { success: false };
		}

		// Fetch fresh user profile to verify the role was updated
		const { data } = await apiClient.get("/user/me");

		if (data?.roles) {
			return { success: true, roles: data.roles };
		}

		return { success: false };
	} catch (error) {
		logger.error("[REFRESH USER SESSION FAILED]", { error });
		return { success: false };
	}
}
