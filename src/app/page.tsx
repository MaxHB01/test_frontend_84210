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

	if (data && data.roles.length === 0) {
		redirect("/role");
	}

	redirect("/mentors");
}
