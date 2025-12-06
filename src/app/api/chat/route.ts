import { NextResponse } from "next/server";

import { getChatsAction } from "@/common/components/chat/api/actions";

export async function GET() {
	try {
		const result = await getChatsAction();

		if (!result.success) {
			return NextResponse.json({ error: result.message }, { status: 500 });
		}

		return NextResponse.json(result.data, { status: 200 });
	} catch {
		return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
	}
}

