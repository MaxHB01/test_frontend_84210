"use server";

import { Environment } from "@/common/config/environment";
import { apiClient } from "@/lib";

import type { ChatApiResponse, ChatMessage } from "../types";

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

export async function getChatMessagesAction(chatId: string) {
	try {
		if (!Environment.API_URL) {
			throw new Error("API URL is not configured");
		}

		const result = await apiClient.get<ChatMessage[]>(`/chat/${chatId}/messages`);

		const { status, data } = result;

		if (status !== 200) {
			throw new Error("Failed to fetch messages");
		}

		return { success: true, data };
	} catch (err: unknown) {
		if (err instanceof Error) {
			return { success: false, message: err.message };
		}

		return { success: false, message: "Failed to fetch messages" };
	}
}
