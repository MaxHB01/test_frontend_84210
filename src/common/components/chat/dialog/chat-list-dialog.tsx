"use client";

import type { ReactElement } from "react";
import { X } from "lucide-react";

import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogPortal,
} from "@/common/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import type { ChatListItem } from "../types";
import { ChatList } from "../list/chat-list";
import styles from "./chat-list-dialog.module.scss";

interface ChatListDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	chats: ChatListItem[];
	onChatClick?: (chat: ChatListItem) => void;
	isLoading?: boolean;
}

export function ChatListDialog({
	open,
	onOpenChange,
	chats,
	onChatClick,
	isLoading = false,
}: ChatListDialogProps): ReactElement {
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
					<DialogHeader className={styles.dialogHeader}>
						<DialogTitle className={styles.dialogTitle}>Your chats</DialogTitle>
					</DialogHeader>
					<div className={styles.dialogBody}>
						<ChatList chats={chats} onChatClick={onChatClick} isLoading={isLoading} />
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

