import axios from "axios";
import { NextResponse } from "next/server";

import type { ChatMessage } from "@/common/components/chat";
import { Environment } from "@/common/config/environment";
import { apiClient } from "@/lib";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { chatId: string } }) {
	const chatId = params.chatId;

	if (!chatId) {
		return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
	}

	if (!Environment.API_URL) {
		return NextResponse.json({ error: "API URL is not configured" }, { status: 500 });
	}

	try {
		const { data } = await apiClient.get<ChatMessage[]>(`/chat/${chatId}/messages`);

		return NextResponse.json(data, { status: 200 });
	} catch (error: unknown) {
		const status = axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500;
		const message = axios.isAxiosError(error)
			? error.response?.data?.message || error.message
			: "Failed to fetch messages";

		return NextResponse.json({ error: message }, { status });
	}
}
