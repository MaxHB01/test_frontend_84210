"use client";

import { type ReactElement, useState } from "react";

import { ChatButton } from "./button/chat-button";
import { ChatListDialog } from "./dialog/chat-list-dialog";
import type { ChatListItem } from "./types";

export interface ChatProps {
	chats: ChatListItem[];
	unreadCount?: number;
	onChatClick?: (chat: ChatListItem) => void;
	isLoading?: boolean;
}

export function Chat({
	chats,
	unreadCount = 0,
	onChatClick,
	isLoading = false,
}: ChatProps): ReactElement {
	const [isOpen, setIsOpen] = useState(false);

	const handleButtonClick = () => {
		setIsOpen(true);
	};

	const handleChatClick = (chat: ChatListItem) => {
		setIsOpen(false);
		onChatClick?.(chat);
	};

	return (
		<>
			<ChatButton unreadCount={unreadCount} onClick={handleButtonClick} />
			<ChatListDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				chats={chats}
				onChatClick={handleChatClick}
				isLoading={isLoading}
			/>
		</>
	);
}

