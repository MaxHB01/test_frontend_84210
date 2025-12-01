"use server";

import { apiClient } from "@/lib";

export async function registerUserAction(form: {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}) {
	try {
		const result = await apiClient.post("/auth/register", {
			...form,
		});

		const { status, data } = result;

		if (status !== 200) {
			throw new Error(data?.error ?? "Registration failed");
		}

		return { success: true };
	} catch (err: unknown) {
		if (err instanceof Error) {
			return { success: false, message: err.message };
		}

		return { success: false, message: "Registration failed" };
	}
}
