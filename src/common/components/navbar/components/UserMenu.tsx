"use client";

import React, { useEffect, useRef, useState } from "react";

import { User } from "lucide-react";

import { Button } from "@/common/components/ui/button";

import ProfileMenuItem from "./ProfileMenuItem";
import SignOutButton from "./SignOutButton";
import UserEmailDisplay from "./UserEmailDisplay";

interface UserMenuProps {
	userId?: string;
	userEmail?: string;
}

export default function UserMenu({ userId, userEmail }: UserMenuProps): React.JSX.Element {
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

	return (
		<div className="relative" ref={menuRef}>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsOpen(!isOpen)}
				className="relative h-10 w-10 rounded-full"
			>
				<User className="h-5 w-5" />
			</Button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200">
					<div className="py-1">
						{userEmail && <UserEmailDisplay email={userEmail} />}
						{userId && (
							<ProfileMenuItem userId={userId} onClick={() => setIsOpen(false)} />
						)}
						<SignOutButton />
					</div>
				</div>
			)}
		</div>
	);
}
