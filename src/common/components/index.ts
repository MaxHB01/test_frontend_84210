export { SignOutButton, Navbar } from "./navbar";
export { ErrorMessage } from "./ui/error-message";

// Unified Chat component - use Chat for everything chat-related
export { Chat } from "./chat";
export type { ChatProps, ChatListItem } from "./chat";

// Legacy exports for backward compatibility (deprecated - use Chat instead)
export { ChatButton } from "./chat/button/chat-button";
export type { ChatButtonProps } from "./chat/button/chat-button";
