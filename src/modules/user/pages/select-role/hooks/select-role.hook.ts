import { useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";

const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-_/?=]+\/?$/i;

export function useSelectRoleForm() {
	const { data: session } = useSession();
	const [selectedRole, setSelectedRole] = useState<"mentor" | "student" | undefined>(undefined);
	const [linkedinUrl, setLinkedinUrl] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false);

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

	const handleSubmit = useCallback(async () => {
		if (!canContinue || !selectedRole) return;

		if (!session?.accessToken) {
			setSubmitError("You must be logged in to select a role.");
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);
		setIsSubmitted(false);

		try {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			headers.Authorization = `Bearer ${session.accessToken}`;

			const response = await fetch("/api/user/role-select", {
				method: "POST",
				headers,
				body: JSON.stringify({
					role: selectedRole,
					linkedInProfileUrl: selectedRole === "mentor" ? linkedinUrl.trim() : "",
				}),
			});

			if (!response.ok) {
				let errorMessage = "Failed to submit role selection.";
				const contentType = response.headers.get("content-type");

				if (contentType?.includes("application/json")) {
					const data = await response.json().catch(() => null);
					errorMessage = data?.error || data?.message || errorMessage;
				} else {
					const text = await response.text();
					if (text) errorMessage = text;
				}

				throw new Error(errorMessage);
			}

			setIsSubmitted(true);
		} catch (error) {
			setSubmitError(
				error instanceof Error ? error.message : "Failed to submit role selection."
			);
		} finally {
			setIsSubmitting(false);
		}
	}, [canContinue, linkedinUrl, selectedRole, session?.accessToken]);

	return {
		selectedRole,
		linkedinUrl,
		canContinue,
		isValidLinkedin,
		isSubmitting,
		submitError,
		isSubmitted,
		handleSubmit,
		setSelectedRole,
		setLinkedinUrl,
	};
}
