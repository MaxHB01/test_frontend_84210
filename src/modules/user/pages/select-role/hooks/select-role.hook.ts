import { type FormEvent, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { selectRole } from "../api/actions";

const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-_/?=]+\/?$/i;

export function useSelectRoleForm() {
	const router = useRouter();

	const [selectedRole, setSelectedRole] = useState<"mentor" | "student" | undefined>(undefined);
	const [linkedinUrl, setLinkedinUrl] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selectedRole || !canContinue || isSubmitting) {
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const status = await selectRole({
				role: selectedRole,
				linkedInProfileUrl: linkedinUrl,
			});

			if (status < 200 || status > 204) {
				setError("Failed to save role");
				return;
			}

			router.push("/");
			router.refresh();
		} catch {
			setError("Failed to connect to server. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return {
		selectedRole,
		linkedinUrl,
		canContinue,
		isValidLinkedin,
		setSelectedRole,
		setLinkedinUrl,
		handleSubmit,
		isSubmitting,
		error,
	};
}
