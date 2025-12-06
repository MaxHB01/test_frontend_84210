import React from "react";

import { Pencil } from "lucide-react";

import { Button, CardHeader } from "@/common/components/ui";
import type { Mentor } from "@/common/domain/entities/mentor";

export function ProfileHeader(mentor: Mentor) {
	function getInitials(firstName: string, lastName: string) {
		const firstLetter = firstName.charAt(0).toUpperCase();
		const lastLetter = lastName.charAt(0).toUpperCase();
		return firstLetter + lastLetter;
	}
	return (
		<CardHeader className="flex items-center justify-between">
			<div className="flex items-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e2e8f1] text-foreground/80 border text-4xl p-10 mr-5">
					{getInitials(mentor.firstName, mentor.lastName)}
				</div>
				<h1 className="text-5xl font-bold text-foreground ">
					{mentor.firstName} {mentor.lastName}
				</h1>
			</div>

			<Button className={"self-start"}>
				<Pencil />
				Edit Profile
			</Button>
		</CardHeader>
	);
}
