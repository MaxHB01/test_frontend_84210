"use server";

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

export async function sendChatMessageAction(chatId: string, messageText: string) {
    try {
        const result = await apiClient.post<ChatMessage>(`/chat/${chatId}/messages`, {
            messageText,
        });

        const { status, data } = result;

        if (status !== 200 && status !== 201) {
            throw new Error("Failed to send message");
        }

        return { success: true, data };
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { success: false, message: err.message };
        }

        return { success: false, message: "Failed to send message" };
    }
}
