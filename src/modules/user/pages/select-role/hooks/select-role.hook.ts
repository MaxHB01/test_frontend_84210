import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

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
			const response = await fetch("/api/role", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					role: selectedRole,
					linkedInProfileUrl: linkedinUrl.trim(),
				}),
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				const message = data.error ?? data.message ?? "Failed to save role";
				setError(message);
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
