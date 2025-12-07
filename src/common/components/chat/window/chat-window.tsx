"use client";

import {
    type FormEvent,
    type MouseEvent,
    type ReactElement,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { MessageSquare } from "lucide-react";

import type { ChatListItem, ChatMessage } from "../types";

import styles from "./chat-window.module.scss";

interface ChatWindowProps {
    chat: ChatListItem;
    messages: ChatMessage[];
    onBack: () => void;
    currentUserId?: string | null;
    isLoading?: boolean;
    error?: string | null;
    onSendMessage?: (messageText: string) => Promise<void> | void;
    isSending?: boolean;
    sendError?: string | null;
}

export function ChatWindow({
                               chat,
                               messages,
                               onBack,
                               currentUserId,
                               isLoading = false,
                               error = null,
                               onSendMessage,
                               isSending = false,
                               sendError = null,
                           }: ChatWindowProps): ReactElement {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messageText, setMessageText] = useState("");

    const emptyStateMessage = useMemo(() => {
        if (isLoading) return "Fetching messages...";
        if (error) return error;
        return "No messages yet. Start the conversation!";
    }, [isLoading, error]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, isLoading]);

    const handleSubmit = async (event: FormEvent | MouseEvent) => {
        event.preventDefault();

        const trimmedMessage = messageText.trim();

        if (!trimmedMessage || !onSendMessage || isSending) return;

        try {
            await onSendMessage(trimmedMessage);
            setMessageText("");
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch {
            // Error is handled by parent state
        }
    };

    const handleSubmitSafe = (event: FormEvent | MouseEvent) => {
        void handleSubmit(event);
    };

    const renderMessage = (message: ChatMessage) => {
        const isCurrentUser = currentUserId === message.userId;
        const shouldShowSender = chat.isGroupChat && !isCurrentUser;

        return (
            <div
                key={message.id}
                className={`${styles.messageRow} ${
                    isCurrentUser ? styles.fromCurrentUser : styles.fromOtherUser
                }`}
                aria-label={`${shouldShowSender ? `${message.senderFullName}: ` : ""}${message.text}`}
            >
                {shouldShowSender && (
                    <div className={styles.senderName}>{message.senderFullName}</div>
                )}
                <div
                    className={`${styles.messageBubble} ${
                        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
                    }`}
                >
                    <p className={styles.messageText}>{message.text}</p>
                    <span className={styles.messageTime}>
						{new Date(message.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
					</span>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.chatWindow} role="region" aria-label={`Chat with ${chat.name}`}>
            <div className={styles.header}>
                <button type="button" className={styles.backButton} onClick={onBack}>
                    Back to chats
                </button>
                <div className={styles.chatMeta}>
                    <span className={styles.chatName}>{chat.name || "Chat"}</span>
                    {chat.isGroupChat && <span className={styles.chatType}>Group chat</span>}
                </div>
            </div>

            <div className={styles.messagesContainer} aria-live="polite">
                {isLoading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner} />
                        <p className={styles.loadingText}>Loading messages...</p>
                    </div>
                ) : messages.length === 0 || error ? (
                    <div className={styles.emptyState}>
                        <MessageSquare className={styles.emptyIcon} />
                        <p className={styles.emptyText}>{emptyStateMessage}</p>
                    </div>
                ) : (
                    messages.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.messageInputBar} aria-label="Message input area">
                <form className={styles.messageForm} onSubmit={handleSubmitSafe}>
                    <input
                        type="text"
                        className={styles.messageInput}
                        placeholder="Type a message"
                        value={messageText}
                        onChange={event => setMessageText(event.target.value)}
                        disabled={isSending || !onSendMessage}
                        aria-label="Type your message"
                    />
                    {sendError && <p className={styles.sendError}>{sendError}</p>}
                </form>
                <button
                    type="submit"
                    className={`${styles.sendButton} ${
                        messageText.trim() && !isSending && onSendMessage
                            ? styles.sendButtonEnabled
                            : styles.sendButtonDisabled
                    }`}
                    onClick={handleSubmitSafe}
                    disabled={!messageText.trim() || isSending || !onSendMessage}
                >
                    {isSending ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}
