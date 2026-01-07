"use client";

import React from "react";

import { User } from "lucide-react";
import Link from "next/link";

interface ProfileMenuItemProps {
	userId: string;
	userRoles?: string[];
	onClick?: () => void;
}

export default function ProfileMenuItem({
	userId,
	userRoles,
	onClick,
}: ProfileMenuItemProps): React.JSX.Element {
	const isMentor = userRoles?.includes("Mentor") ?? false;
	const href = isMentor ? `/mentors/${userId}` : `/edit-profile`;

	return (
		<Link
			href={href}
			onClick={onClick}
			className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
		>
			<User className="mr-2 h-4 w-4" />
			Profile
		</Link>
	);
}
