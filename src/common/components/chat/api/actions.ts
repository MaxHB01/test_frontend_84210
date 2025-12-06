"use server";

import { apiClient } from "@/lib";

import type { ChatApiResponse } from "../types";

export async function getChatsAction() {
	try {
		const result = await apiClient.get<ChatApiResponse[]>("/chat");

		const { status, data } = result;

		if (status !== 200) {
			throw new Error("Failed to fetch chats");
		}

		return { success: true, data };
	} catch (err: unknown) {
		if (err instanceof Error) {
			return { success: false, message: err.message };
		}

		return { success: false, message: "Failed to fetch chats" };
	}
}

