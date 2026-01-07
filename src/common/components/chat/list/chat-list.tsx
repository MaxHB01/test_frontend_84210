"use client";

import type { ReactElement } from "react";

import { MessageSquare } from "lucide-react";

import type { ChatListItem } from "../types";
import { ChatListItemComponent } from "./chat-list-item";

import styles from "./chat-list.module.scss";

interface ChatListProps {
	chats: ChatListItem[];
	onChatClick?: (chat: ChatListItem) => void;
	isLoading?: boolean;
	emptyMessage?: string;
}

export function ChatList({
	chats,
	onChatClick,
	isLoading = false,
	emptyMessage = "No chats yet. Start a conversation!",
}: ChatListProps): ReactElement {
	if (isLoading) {
		return (
			<div className={styles.loadingState}>
				<div className={styles.loadingSpinner} />
				<p className={styles.loadingText}>Loading chats...</p>
			</div>
		);
	}

	if (chats.length === 0) {
		return (
			<div className={styles.emptyState}>
				<MessageSquare className={styles.emptyStateIcon} />
				<p className={styles.emptyStateTitle}>No chats yet</p>
				<p className={styles.emptyStateText}>{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className={styles.chatList} role="list" aria-label="Chat list">
			{chats.map(chat => (
				<ChatListItemComponent
					key={chat.id}
					chat={chat}
					onClick={() => onChatClick?.(chat)}
				/>
			))}
		</div>
	);
}
