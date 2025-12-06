"use client";

import React from "react";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps {
	className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps): React.JSX.Element {
	const handleSignOut = () => {
		void signOut({ callbackUrl: "/" });
	};

	return (
		<button
			onClick={handleSignOut}
			className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className ?? ""}`}
		>
			<LogOut className="mr-2 h-4 w-4" />
			Logout
		</button>
	);
}
