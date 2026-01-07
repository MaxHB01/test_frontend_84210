// API Response types based on backend
export interface ChatApiResponse {
	id: string;
	isGroupChat: boolean;
	name: string;
	createdAt: string;
	createdByUserId: string;
	joinedAt: string;
}

// Extended type for UI (includes fields that will come from backend later)
export interface ChatListItem extends ChatApiResponse {
	// These fields will be populated from backend API responses
	lastMessage?: string;
	lastMessageTime?: string;
	hasUnread?: boolean;
	avatar?: string;
	userInitials?: string;
}

export interface ChatMessage {
	id: string;
	chatId: string;
	userId: string;
	senderFullName: string;
	text: string;
	sentAt: string;
}
