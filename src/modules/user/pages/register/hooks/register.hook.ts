import { useMemo, useState, type FormEvent } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function useRegisterForm() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [hasTypedEmail, setHasTypedEmail] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const isValidEmail = useMemo(() => {
		return emailRegex.test(email.trim());
	}, [email]);

	const handleEmailChange = (value: string) => {
		setEmail(value);
		if (!hasTypedEmail && value !== "") {
			setHasTypedEmail(true);
		}
	};

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		if (!isValidEmail) {
			setError("Invalid email");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, lastName, email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Registration failed");
			}

			// Success - redirect to login or dashboard
			window.location.href = "/login";
		} catch (e: unknown) {
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError("Registration failed");
			}
		} finally {
			setLoading(false);
		}
	}

	return {
		firstName,
		lastName,
		email,
		password,
		confirmPassword,
		showPassword,
		showConfirmPassword,
		isValidEmail,
		hasTypedEmail,
		handleEmailChange,
		setFirstName,
		setLastName,
		setPassword,
		setConfirmPassword,
		setShowPassword,
		setShowConfirmPassword,
		loading,
		error,
		handleSubmit,
	};
}
