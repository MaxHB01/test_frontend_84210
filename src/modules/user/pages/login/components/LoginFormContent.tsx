import React from "react";
import { Button, ErrorMessage } from "@/common/components/ui";
import { EmailField, PasswordField } from "./LoginFormFields";
import type { LoginFormProps } from "./interfaces";

export function LoginFormContent({
	email,
	setEmail,
	password,
	setPassword,
	showPassword,
	setShowPassword,
	error,
	loading,
	fieldErrors,
	handleSubmit,
	clearFieldError,
}: LoginFormProps): React.JSX.Element {
	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		void handleSubmit(e);
	};

	return (
		<form onSubmit={handleFormSubmit} className="space-y-4">
			{error && <ErrorMessage message={error} />}

			<EmailField
				email={email}
				setEmail={setEmail}
				fieldErrors={fieldErrors}
				clearFieldError={clearFieldError}
			/>

			<PasswordField
				password={password}
				setPassword={setPassword}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				fieldErrors={fieldErrors}
				clearFieldError={clearFieldError}
			/>

			<Button
				type="submit"
				disabled={loading}
				variant={"default"}
				size={"lg"}
				className="w-full"
			>
				{loading ? "Signing in..." : "Continue"}
			</Button>
		</form>
	);
}
