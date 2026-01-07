import type React from "react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { apiClient } from "@/lib";

export default async function Home(): Promise<React.JSX.Element> {
	const session = await auth();

	if (!session) {
		redirect("/auth/login");
	}

	const { data } = await apiClient.get("/user/me");

	// Check if user has no roles (null, undefined, or empty array)
	if (!data?.roles || data.roles.length === 0) {
		redirect("/role");
	}

	redirect("/mentors");
}
