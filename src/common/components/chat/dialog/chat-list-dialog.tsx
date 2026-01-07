"use client";

import type { ReactElement } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Dialog, DialogHeader, DialogPortal, DialogTitle } from "@/common/components/ui/dialog";

import { ChatList } from "../list/chat-list";
import type { ChatListItem, ChatMessage } from "../types";
import { ChatWindow } from "../window/chat-window";

import styles from "./chat-list-dialog.module.scss";

interface ChatListDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	chats: ChatListItem[];
	onChatClick?: (chat: ChatListItem) => void;
	isLoading?: boolean;
	selectedChat?: ChatListItem | null;
	onBackToList?: () => void;
	messages?: ChatMessage[];
	isMessagesLoading?: boolean;
	messagesError?: string | null;
	currentUserId?: string | null;
	onSendMessage?: (messageText: string) => Promise<void> | void;
	isSendingMessage?: boolean;
	sendMessageError?: string | null;
}

export function ChatListDialog({
	open,
	onOpenChange,
	chats,
	onChatClick,
	isLoading = false,
	selectedChat,
	onBackToList,
	messages = [],
	isMessagesLoading = false,
	messagesError = null,
	currentUserId,
	onSendMessage,
	isSendingMessage = false,
	sendMessageError = null,
}: ChatListDialogProps): ReactElement {
	const isViewingChat = Boolean(selectedChat);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogPortal>
				<DialogPrimitive.Content
					className={styles.dialogContent}
					onPointerDownOutside={() => {
						// Allow closing when clicking outside
						onOpenChange(false);
					}}
				>
					{!isViewingChat && (
						<DialogHeader className={styles.dialogHeader}>
							<DialogTitle className={styles.dialogTitle}>Your chats</DialogTitle>
						</DialogHeader>
					)}
					<div
						className={`${styles.dialogBody} ${
							isViewingChat ? styles.dialogBodyChat : ""
						}`}
					>
						{isViewingChat && selectedChat ? (
							<ChatWindow
								chat={selectedChat}
								messages={messages}
								onBack={onBackToList ?? (() => onOpenChange(true))}
								currentUserId={currentUserId}
								isLoading={isMessagesLoading}
								error={messagesError}
								onSendMessage={onSendMessage}
								isSending={isSendingMessage}
								sendError={sendMessageError}
							/>
						) : (
							<ChatList
								chats={chats}
								onChatClick={onChatClick}
								isLoading={isLoading}
							/>
						)}
					</div>
					<DialogPrimitive.Close className={styles.closeButton}>
						<X size={16} />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	);
}
