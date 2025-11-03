import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validateLoginForm } from "../components/login-validation";

export function useLoginHandler() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
	const router = useRouter();

	const validateForm = () => {
		const errors = validateLoginForm(email, password);
		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const clearFieldError = (field: "email" | "password") => {
		if (fieldErrors[field]) {
			setFieldErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();
		setError("");
		setFieldErrors({});

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError("Invalid email or password, Please try again.");
			} else if (result?.ok) {
				router.push("/");
				router.refresh();
			}
		} catch {
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return {
		email,
		setEmail,
		password,
		setPassword,
		error,
		loading,
		fieldErrors,
		handleSubmit,
		clearFieldError,
	};
}
