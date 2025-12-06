"use client";

import type { ReactElement, MouseEventHandler } from "react";
import { MessageCircleMore } from "lucide-react";

import styles from "./chat-button.module.scss";

export interface ChatButtonProps {
	unreadCount?: number;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	ariaLabel?: string;
}

export function ChatButton({
	unreadCount = 0,
	onClick,
	ariaLabel = "Open chat",
}: ChatButtonProps): ReactElement {
	const displayUnread = Math.min(unreadCount, 99);

	return (
		<button
			className={styles.chatButton}
			type="button"
			aria-label={ariaLabel}
			onClick={onClick}
		>
			<MessageCircleMore size={24} />

			{displayUnread > 0 && (
				<span className={styles.badge} aria-label={`${displayUnread} unread messages`}>
					{displayUnread.toString().padStart(2)}
				</span>
			)}
		</button>
	);
}

