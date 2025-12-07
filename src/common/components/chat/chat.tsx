"use client";

import { type ReactElement, useCallback, useEffect, useRef, useState } from "react";

import {
    type HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
} from "@microsoft/signalr";

import { Environment } from "@/common/config/environment";

import { ChatButton } from "./button/chat-button";
import { ChatListDialog } from "./dialog/chat-list-dialog";
import type { ChatListItem, ChatMessage } from "./types";

export interface ChatProps {
    chats: ChatListItem[];
    unreadCount?: number;
    onChatClick?: (chat: ChatListItem) => void;
    isLoading?: boolean;
    currentUserId?: string | null;
    accessToken?: string | null;
}

export function Chat({
                         chats,
                         unreadCount = 0,
                         onChatClick,
                         isLoading = false,
                         currentUserId,
                         accessToken,
                     }: ChatProps): ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [sendMessageError, setSendMessageError] = useState<string | null>(null);
    const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
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
            setSendMessageError(null);
            setIsSendingMessage(false);
            activeChatIdRef.current = null;
        }
    };

    const loadMessages = useCallback(async (chatId: string) => {
        activeChatIdRef.current = chatId;
        setIsMessagesLoading(true);
        setMessagesError(null);
        setSendMessageError(null);
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

    const hubUrl = Environment.CHAT_HUB_URL;

    const handleChatClick = (chat: ChatListItem) => {
        setSelectedChat(chat);
        setIsOpen(true);
        onChatClick?.(chat);
    };

    const handleBackToList = () => {
        setSelectedChat(null);
        setMessages([]);
        setMessagesError(null);
        setSendMessageError(null);
        activeChatIdRef.current = null;
    };

    const handleSendMessage = useCallback(
        async (messageText: string) => {
            if (!selectedChat) return;

            setIsSendingMessage(true);
            setSendMessageError(null);

            let sentViaHub = false;

            try {
                if (hubConnection?.state === HubConnectionState.Connected && hubConnection.invoke) {
                    await hubConnection.invoke("SendMessageToChat", selectedChat.id, messageText);
                    sentViaHub = true;
                }
            } catch {
                setSendMessageError("Failed to send message through live connection.");
            }

            if (!sentViaHub) {
                try {
                    const response = await fetch(`/api/chatMessages/${selectedChat.id}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ messageText }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to send message");
                    }

                    const data = (await response.json()) as ChatMessage;

                    setMessages(previousMessages => [...previousMessages, data]);
                    setSendMessageError(null);
                } catch (error) {
                    setSendMessageError(
                        error instanceof Error ? error.message : "Failed to send message"
                    );
                } finally {
                    setIsSendingMessage(false);
                }

                return;
            }

            setIsSendingMessage(false);
        },
        [hubConnection, selectedChat]
    );

    useEffect(() => {
        if (!selectedChat) return;

        void loadMessages(selectedChat.id);
    }, [selectedChat, loadMessages]);

    useEffect(() => {
        if (!isOpen || !hubUrl || !accessToken) {
            return;
        }

        const connection = new HubConnectionBuilder()
            .withUrl(hubUrl, {
                accessTokenFactory: () => accessToken,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        connection.on("ReceiveMessage", payload => {
            const incomingMessage: ChatMessage = {
                id: payload.id,
                chatId: payload.chatId,
                userId: payload.userId,
                senderFullName: payload.senderFullName,
                text: payload.text,
                sentAt: payload.sentAt,
            };

            setMessages(previousMessages => {
                if (incomingMessage.chatId !== activeChatIdRef.current) {
                    return previousMessages;
                }

                const alreadyExists = previousMessages.some(
                    message => message.id === incomingMessage.id
                );

                if (alreadyExists) {
                    return previousMessages;
                }

                return [...previousMessages, incomingMessage];
            });
        });

        connection
            .start()
            .then(() => setHubConnection(connection))
            .catch(() => {
                setSendMessageError("Failed to connect to chat service.");
            });

        return () => {
            setHubConnection(null);
            void connection.stop();
        };
    }, [accessToken, hubUrl, isOpen]);

    useEffect(() => {
        if (!hubConnection || hubConnection.state !== HubConnectionState.Connected) {
            return;
        }

        if (!selectedChat) {
            return;
        }

        const joinChat = async () => {
            try {
                await hubConnection.invoke("JoinChat", selectedChat.id);
            } catch {
                setSendMessageError("Unable to join chat room.");
            }
        };

        void joinChat();

        return () => {
            void hubConnection.invoke("LeaveChat", selectedChat.id);
        };
    }, [hubConnection, selectedChat]);

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
                onSendMessage={handleSendMessage}
                isSendingMessage={isSendingMessage}
                sendMessageError={sendMessageError}
            />
        </>
    );
}
