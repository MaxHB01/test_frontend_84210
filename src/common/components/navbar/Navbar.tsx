"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import UserMenu from "./components/UserMenu";

interface NavbarProps {
	session?: {
		user?: {
			id?: string;
			email?: string;
			roles?: string[];
		};
	} | null;
}

export default function Navbar({ session }: NavbarProps): React.JSX.Element {
	const pathname = usePathname();
	const isMentorsActive = pathname?.startsWith("/mentors");

	return (
		<header className="bg-background shadow-sm border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-8">
						<Link href="/">
							<h1 className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors">
								GrowPath
							</h1>
						</Link>
						<nav className="flex items-center space-x-4">
							{session && (
								<Link
									href="/mentors"
									className={`px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
										isMentorsActive
											? "text-foreground font-bold"
											: "text-muted-foreground hover:text-foreground font-medium"
									}`}
								>
									Mentors
								</Link>
							)}
						</nav>
					</div>
					<div className="flex items-center space-x-4">
						<UserMenu
							userId={session?.user?.id}
							userEmail={session?.user?.email}
							userRoles={session?.user?.roles}
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
