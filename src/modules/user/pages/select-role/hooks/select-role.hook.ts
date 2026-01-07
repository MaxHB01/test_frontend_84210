import { type FormEvent, useMemo, useState } from "react";

import { useSession } from "next-auth/react";

import { selectRole } from "../api/actions";

const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-_/?=]+\/?$/i;

export function useSelectRoleForm() {
	const { update } = useSession();

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

			// Wait a moment for backend to process the role update
			await new Promise(resolve => setTimeout(resolve, 300));

			// Refresh the session to get the updated role
			// Call update() which triggers the JWT callback with trigger: "update"
			try {
				await update();
			} catch {
				// Continue anyway - the JWT callback fallback will fetch roles on next request
			}

			// Use window.location for a hard navigation to ensure session is refreshed
			// The JWT callback will automatically fetch fresh roles if they're missing
			// This forces a full page reload with the updated session
			window.location.href = "/";
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
