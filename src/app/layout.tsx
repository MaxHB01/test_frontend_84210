import React, { type ReactNode } from "react";

import type { Metadata } from "next";

import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { ChatProvider } from "@/common/components/chat/chat-provider";
import { Navbar } from "@/common/components/navbar";
import "@/common/styles/globals.css";
import "@/common/styles/main.scss";

export const metadata: Metadata = {
	title: "GrowPath",
	description: "The next big thing in the world of education",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>): Promise<React.JSX.Element> {
	const session = await auth();

	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-background text-foreground">
				<SessionProvider>
					<Navbar session={session} />
					{children}
					<ChatProvider />
				</SessionProvider>
			</body>
		</html>
	);
}
