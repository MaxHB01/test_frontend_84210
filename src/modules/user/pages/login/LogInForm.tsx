"use client";
import React, { useState } from "react";
import { useLoginHandler } from "./hooks/use-login.hook";
import { LoginCard, LoginFormContent } from "./components";

export default function LogInForm(): React.JSX.Element {
	const [showPassword, setShowPassword] = useState(false);
	const {
		email,
		setEmail,
		password,
		setPassword,
		error,
		loading,
		fieldErrors,
		handleSubmit,
		clearFieldError,
	} = useLoginHandler();

	return (
		<LoginCard>
			<LoginFormContent
				email={email}
				setEmail={setEmail}
				password={password}
				setPassword={setPassword}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				error={error}
				loading={loading}
				fieldErrors={fieldErrors}
				handleSubmit={handleSubmit}
				clearFieldError={clearFieldError}
			/>
		</LoginCard>
	);
}
