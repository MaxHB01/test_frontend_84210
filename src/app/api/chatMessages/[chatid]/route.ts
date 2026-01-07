import { type NextRequest, NextResponse } from "next/server";

import { getChatMessagesAction, sendChatMessageAction } from "@/common/components/chat/api/actions";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ chatId: string }> }
): Promise<Response> {
	const { chatId } = await params;
	if (!chatId) {
		return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
	}

	try {
		const result = await getChatMessagesAction(chatId);

		if (!result.success) {
			return NextResponse.json({ error: result.message }, { status: 500 });
		}

		return NextResponse.json(result.data, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
	}
}

export async function POST(
	_request: NextRequest,
	{ params }: { params: Promise<{ chatId: string }> }
): Promise<Response> {
	const { chatId } = await params;

	if (!chatId) {
		return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
	}

	try {
		const body = await _request.json();
		const messageText = body?.messageText;

		if (!messageText || typeof messageText !== "string" || !messageText.trim()) {
			return NextResponse.json({ error: "Message text is required" }, { status: 400 });
		}

		const result = await sendChatMessageAction(chatId, messageText);

		if (!result.success) {
			return NextResponse.json({ error: result.message }, { status: 500 });
		}

		return NextResponse.json(result.data, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
	}
}
