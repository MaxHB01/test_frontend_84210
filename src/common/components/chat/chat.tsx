"use client";

import { type ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { ChatButton } from "./button/chat-button";
import { ChatListDialog } from "./dialog/chat-list-dialog";
import type { ChatListItem, ChatMessage } from "./types";

export interface ChatProps {
	chats: ChatListItem[];
	unreadCount?: number;
	onChatClick?: (chat: ChatListItem) => void;
	isLoading?: boolean;
    currentUserId?: string | null;
}

export function Chat({
	chats,
	unreadCount = 0,
	onChatClick,
	isLoading = false,
    currentUserId,
}: ChatProps): ReactElement {
	const [isOpen, setIsOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const activeChatIdRef = useRef<string | null>(null);

	const handleButtonClick = () => {
		setIsOpen(true);
	};

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);

        if (!open) {
            setSelectedChat(null);
            setMessages([]);
            setMessagesError(null);
            activeChatIdRef.current = null;
        }
    };

    const loadMessages = useCallback(async (chatId: string) => {
        activeChatIdRef.current = chatId;
        setIsMessagesLoading(true);
        setMessagesError(null);
        setMessages([]);

        try {
            const response = await fetch(`/api/chatMessages/${chatId}`);

            if (!response.ok) {
                throw new Error("Failed to load messages");
            }

            const data = await response.json();

            if (activeChatIdRef.current === chatId) {
                setMessages(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            if (activeChatIdRef.current === chatId) {
                setMessagesError(
                    error instanceof Error ? error.message : "Failed to load messages"
                );
                setMessages([]);
            }
        } finally {
            if (activeChatIdRef.current === chatId) {
                setIsMessagesLoading(false);
            }
        }
    }, []);

	const handleChatClick = (chat: ChatListItem) => {
        setSelectedChat(chat);
        setIsOpen(true);
		onChatClick?.(chat);
	};

    const handleBackToList = () => {
        setSelectedChat(null);
        setMessages([]);
        setMessagesError(null);
        activeChatIdRef.current = null;
    };

    useEffect(() => {
        if (!selectedChat) return;

        void loadMessages(selectedChat.id);
    }, [selectedChat, loadMessages]);

	return (
		<>
			<ChatButton unreadCount={unreadCount} onClick={handleButtonClick} />
			<ChatListDialog
				open={isOpen}
                onOpenChange={handleOpenChange}
				chats={chats}
				onChatClick={handleChatClick}
				isLoading={isLoading}
                selectedChat={selectedChat}
                onBackToList={handleBackToList}
                messages={messages}
                isMessagesLoading={isMessagesLoading}
                messagesError={messagesError}
                currentUserId={currentUserId}
			/>
		</>
	);
}
