"use client";

import React from "react";

import { signOut } from "next-auth/react";

import { Button } from "@/common/components/ui";

export default function SignOutButton(): React.JSX.Element {
	const handleSignOut = () => {
		void signOut({ callbackUrl: "/" });
	};

	return (
		<Button
			onClick={handleSignOut}
			variant="default"
			size="sm"
			className="bg-[#006633] hover:bg-[#004d26] text-white"
		>
			Sign Out
		</Button>
	);
}
