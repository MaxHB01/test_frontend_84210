import { redirect } from "next/navigation";

import { apiClient } from "@/lib";
import { SelectRolePage } from "@/modules/user/pages";

export default async function SelectRoleWrapper() {
	const { data } = await apiClient.get("/user/me");

	if (data.roles && data.roles.length >= 1) {
		redirect("/mentors");
	}

	return <SelectRolePage />;
}
