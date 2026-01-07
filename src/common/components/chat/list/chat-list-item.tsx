"use client";

import type { ReactElement } from "react";

import type { ChatListItem } from "../types";
import { getInitials } from "../utils";

import styles from "./chat-list.module.scss";

interface ChatListItemProps {
	chat: ChatListItem;
	onClick?: () => void;
}

export function ChatListItemComponent({ chat, onClick }: ChatListItemProps): ReactElement {
	const initials = chat.userInitials || getInitials(chat.name) || "CN";
	const displayName = chat.name || "Username";
	const lastMessage = chat.lastMessage || "This is the last message which...";

	return (
		<button
			type="button"
			className={styles.chatListItem}
			onClick={onClick}
			aria-label={`Open chat with ${displayName}`}
		>
			<div className={styles.avatar}>
				{chat.avatar ? (
					<img src={chat.avatar} alt={displayName} className={styles.avatarImage} />
				) : (
					<span className={styles.avatarInitials}>{initials}</span>
				)}
			</div>

			<div className={styles.chatContent}>
				<div className={styles.chatHeader}>
					<span className={styles.username}>{displayName}</span>
				</div>
				<div className={styles.chatPreview}>
					<span className={styles.lastMessage}>{lastMessage}</span>
				</div>
			</div>

			{chat.hasUnread && (
				<div className={styles.unreadIndicator} aria-label="Unread messages" />
			)}
		</button>
	);
}
