import { redirect } from "next/navigation";

import { apiClient } from "@/lib";
import { MentorListPage as Mlp } from "@/modules/mentor/pages";

export default async function MentorWrapperPage({
	searchParams,
}: {
	searchParams: Promise<{ topic?: string }>;
}) {
	const { data } = await apiClient.get("/user/me");

	if (!data.roles || data.roles.length === 0) {
		redirect("/role");
	}

	return <Mlp searchParams={searchParams} />;
}
