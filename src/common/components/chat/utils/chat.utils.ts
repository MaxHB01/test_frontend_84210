import type { ChatListItem } from "../types";
import { getInitials } from "@/lib/utils";

export { getInitials };

export function formatMessageTime(timeString?: string): string {
	if (!timeString) return "";

	const date = new Date(timeString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return "Just now";
	}

	if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes}m ago`;
	}

	if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours}h ago`;
	}

	if (diffInSeconds < 604800) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days}d ago`;
	}

	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function truncateMessage(message: string, maxLength: number = 50): string {
	if (!message) return "";
	if (message.length <= maxLength) return message;
	return `${message.substring(0, maxLength)}...`;
}

export function sortChatsByLastMessage(chats: ChatListItem[]): ChatListItem[] {
	return [...chats].sort((a, b) => {
		const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
		const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
		return timeB - timeA;
	});
}

export function filterChatsByQuery(chats: ChatListItem[], query: string): ChatListItem[] {
	if (!query.trim()) return chats;

	const lowerQuery = query.toLowerCase();
	return chats.filter(
		chat =>
			chat.name.toLowerCase().includes(lowerQuery) ||
			chat.lastMessage?.toLowerCase().includes(lowerQuery)
	);
}

export function calculateUnreadCount(chats: ChatListItem[]): number {
	return chats.filter(chat => chat.hasUnread).length;
}

