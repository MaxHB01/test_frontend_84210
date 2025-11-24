import type React from "react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function Home(): Promise<React.JSX.Element> {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	redirect("/mentors");
}
