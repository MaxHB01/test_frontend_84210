"use client";

import { type ReactElement, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { Chat } from "./chat";
import type { ChatListItem } from "./types";
import { calculateUnreadCount } from "./utils";

async function fetchSessionAndChats(pathname: string): Promise<{
	hasSession: boolean;
	chats: ChatListItem[];
	unreadCount: number;
}> {
	const isAuthPage = pathname.startsWith("/auth");
	if (isAuthPage) {
		return { hasSession: false, chats: [], unreadCount: 0 };
	}

	const sessionResponse = await fetch("/api/auth/session");
	if (!sessionResponse.ok) {
		return { hasSession: false, chats: [], unreadCount: 0 };
	}

	const session = await sessionResponse.json();
	if (!session || !session.user) {
		return { hasSession: false, chats: [], unreadCount: 0 };
	}

	try {
		const response = await fetch("/api/chat");
		if (response.ok) {
			const data = await response.json();
			const chats = Array.isArray(data) ? data : [];
			return {
				hasSession: true,
				chats,
				unreadCount: calculateUnreadCount(chats),
			};
		}
	} catch {
		// Chat endpoint not available yet - still show button with empty chats
	}

	return {
		hasSession: true,
		chats: [],
		unreadCount: 0,
	};
}

export function ChatProvider(): ReactElement | null {
	const [hasSession, setHasSession] = useState(false);
	const [chats, setChats] = useState<ChatListItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [unreadCount, setUnreadCount] = useState(0);
	const pathname = usePathname();
	const isMountedRef = useRef(true);
	const isFetchingRef = useRef(false);

	const checkSessionAndFetchChats = async () => {
		if (!isMountedRef.current || isFetchingRef.current) return;

		try {
			isFetchingRef.current = true;
			setIsLoading(true);
			const result = await fetchSessionAndChats(pathname);

			if (!isMountedRef.current) return;

			setHasSession(result.hasSession);
			setChats(result.chats);
			setUnreadCount(result.unreadCount);
			setIsLoading(false);
		} catch {
			if (!isMountedRef.current) return;
			setHasSession(false);
			setChats([]);
			setIsLoading(false);
		} finally {
			isFetchingRef.current = false;
		}
	};

	useEffect(() => {
		isMountedRef.current = true;
		void checkSessionAndFetchChats();
		return () => {
			isMountedRef.current = false;
		};
	}, [pathname]);

	useEffect(() => {
		if (hasSession) return;

		const interval = setInterval(() => {
			if (!isLoading && !isFetchingRef.current) {
				void checkSessionAndFetchChats();
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [hasSession, isLoading]);

	useEffect(() => {
		if (!hasSession) return;

		const handleStorageChange = () => {
			void checkSessionAndFetchChats();
		};

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("focus", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("focus", handleStorageChange);
		};
	}, [hasSession]);

	const handleChatClick = (chat: ChatListItem) => {
		// Handle chat click - TODO: implement navigation to chat
		void chat;
	};

	if (!hasSession) {
		return null;
	}

	return (
		<Chat
			chats={chats}
			unreadCount={unreadCount}
			onChatClick={handleChatClick}
			isLoading={isLoading}
		/>
	);
}
