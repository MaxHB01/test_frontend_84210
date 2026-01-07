"use client";

import React, { useEffect, useRef, useState } from "react";

import { LogIn, User, UserPlus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/common/components/ui/button";

import ProfileMenuItem from "./ProfileMenuItem";
import SignOutButton from "./SignOutButton";
import UserEmailDisplay from "./UserEmailDisplay";

interface UserMenuProps {
	userId?: string;
	userEmail?: string;
	userRoles?: string[];
}

export default function UserMenu({
	userId,
	userEmail,
	userRoles,
}: UserMenuProps): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const isLoggedIn = !!userId;

	return (
		<div className="relative" ref={menuRef}>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsOpen(!isOpen)}
				className="relative h-10 w-10 rounded-full"
			>
				{isLoggedIn ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
			</Button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 rounded-md bg-background shadow-lg z-50">
					<div className="py-1">
						{isLoggedIn ? (
							<>
								{userEmail && <UserEmailDisplay email={userEmail} />}
								{userId && (
									<ProfileMenuItem
										userId={userId}
										userRoles={userRoles}
										onClick={() => setIsOpen(false)}
									/>
								)}
								<SignOutButton />
							</>
						) : (
							<>
								<Link
									href="/auth/login"
									onClick={() => setIsOpen(false)}
									className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
								>
									<LogIn className="mr-2 h-4 w-4" />
									Login
								</Link>
								<Link
									href="/auth/register"
									onClick={() => setIsOpen(false)}
									className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
								>
									<UserPlus className="mr-2 h-4 w-4" />
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
