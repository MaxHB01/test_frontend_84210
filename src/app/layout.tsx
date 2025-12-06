import React, { type ReactNode } from "react";

import type { Metadata } from "next";

import "@/common/styles/globals.css";
import "@/common/styles/main.scss";

import { ChatProvider } from "@/common/components/chat/chat-provider";

export const metadata: Metadata = {
	title: "GrowPath",
	description: "The next big thing in the world of education",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>): React.JSX.Element {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-background text-foreground">
				{children}
				<ChatProvider />
			</body>
		</html>
	);
}
