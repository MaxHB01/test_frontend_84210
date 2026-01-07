"use server";

import { apiClient } from "@/lib";

export async function searchTopics(query: string): Promise<string[]> {
	if (!query || query.trim().length === 0) {
		return [];
	}

	try {
		const { status, data } = await apiClient.get("/topics", {
			params: { query: query.trim() },
		});

		if (status === 200 && Array.isArray(data)) {
			return data.filter((topic): topic is string => typeof topic === "string");
		}

		return [];
	} catch (error) {
		// For expected errors (404, 401, 400), return empty array
		if (error && typeof error === "object" && "response" in error) {
			const axiosError = error as { response?: { status?: number } };
			const errorStatus = axiosError.response?.status;

			if (errorStatus === 404 || errorStatus === 401 || errorStatus === 400) {
				return [];
			}
		}

		// For unexpected errors, return empty array to avoid breaking the UI
		return [];
	}
}
