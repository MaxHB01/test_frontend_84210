import { NextResponse } from "next/server";

import { getChatMessagesAction } from "@/common/components/chat/api/actions";

export async function GET(_request: Request, { params }: { params: { chatId: string } }) {
    const chatId = params.chatId;

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
