"use client";
import type { ReactElement } from "react";

import { Button, CardContent, CardFooter } from "@/common/components/ui";
import { InputWithLabel } from "@/common/components/ui/input-with-label";
import { useRegisterForm } from "@/modules/user/pages/register/hooks/register.hook";

export default function RegisterForm(): ReactElement {
	const {
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
	} = useRegisterForm();

	return (
		<form
			onSubmit={e => {
				void handleSubmit(e);
			}}
			className="grid w-full items-center gap-4"
		>
			<CardContent className="grid w-full items-center gap-4">
				<InputWithLabel
					id={"firstName"}
					label={"First Name"}
					value={firstName}
					setValue={setFirstName}
				/>
				<InputWithLabel
					id={"lastName"}
					label={"Last name"}
					value={lastName}
					setValue={setLastName}
				/>
				<InputWithLabel
					id={"email"}
					label={"Email"}
					value={email}
					setValue={handleEmailChange}
					isValid={isValidEmail}
					notValidText={"Pleas enter a valid email."}
					hasTyped={hasTypedEmail}
				/>
				<InputWithLabel
					id={"password"}
					label={"Password"}
					value={password}
					setValue={setPassword}
					type={showPassword ? "text" : "password"}
					showPassword={showPassword}
					setShow={setShowPassword}
				/>
				<InputWithLabel
					id={"confirmPassword"}
					label={"Confirm Password"}
					placeholder={"Password"}
					value={confirmPassword}
					setValue={setConfirmPassword}
					type={showConfirmPassword ? "text" : "password"}
					showPassword={showConfirmPassword}
					setShow={setShowConfirmPassword}
				/>
			</CardContent>
			<div>{error && <div className="text-destructive text-center">{error}</div>}</div>
			<CardFooter>
				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? "Signing up..." : "Signup"}
				</Button>
			</CardFooter>
		</form>
	);
}
