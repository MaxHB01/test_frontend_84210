export function validateLoginForm(
	email: string,
	password: string
): { email?: string; password?: string } {
	const errors: { email?: string; password?: string } = {};

	if (!email.trim()) {
		errors.email = "Email is required";
	} else if (!/\S+@\S+\.\S+/.test(email)) {
		errors.email = "Please enter a valid email address";
	}

	if (!password.trim()) {
		errors.password = "Password is required";
	} else if (password.length < 6) {
		errors.password = "Password must be at least 6 characters";
	}

	return errors;
}
