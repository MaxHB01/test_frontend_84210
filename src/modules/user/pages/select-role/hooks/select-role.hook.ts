import { useState, useMemo } from "react";

const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-_/?=]+\/?$/i;

export function useSelectRoleForm() {
	const [selectedRole, setSelectedRole] = useState<"mentor" | "student" | undefined>(undefined);
	const [linkedinUrl, setLinkedinUrl] = useState("");

	const isValidLinkedin = useMemo(() => {
		if (selectedRole !== "mentor") return true;
		if (linkedinUrl === "") return true;
		return linkedinRegex.test(linkedinUrl.trim());
	}, [selectedRole, linkedinUrl]);

	const canContinue = useMemo(() => {
		if (!selectedRole) return false;
		if (selectedRole === "mentor") return linkedinRegex.test(linkedinUrl.trim());
		return true;
	}, [selectedRole, linkedinUrl]);

	return {
		selectedRole,
		linkedinUrl,
		canContinue,
		isValidLinkedin,
		setSelectedRole,
		setLinkedinUrl,
	};
}
