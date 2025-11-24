import React from "react";

import { Input, Label, PasswordInput } from "@/common/components/ui";

import type { EmailFieldProps, PasswordFieldProps } from "./interfaces";

export function EmailField({
	email,
	setEmail,
	fieldErrors,
	clearFieldError,
}: EmailFieldProps): React.JSX.Element {
	return (
		<div className="space-y-2">
			<Label htmlFor="email" className="text-sm font-medium">
				Email
			</Label>
			<Input
				id="email"
				type="email"
				value={email}
				onChange={e => {
					setEmail(e.target.value);
					clearFieldError("email");
				}}
				placeholder="Email"
				required
				className={`w-full ${fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
			/>
			{fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
		</div>
	);
}

export function PasswordField({
	password,
	setPassword,
	showPassword,
	setShowPassword,
	fieldErrors,
	clearFieldError,
}: PasswordFieldProps): React.JSX.Element {
	return (
		<div className="space-y-2">
			<Label htmlFor="password">Password</Label>
			<PasswordInput
				id="password"
				value={password}
				onChange={e => {
					setPassword(e.target.value);
					clearFieldError("password");
				}}
				placeholder="Password"
				required
				showPassword={showPassword}
				onToggleVisibility={() => setShowPassword(!showPassword)}
				className={fieldErrors.password ? "border-red-500 focus:border-red-500" : ""}
			/>
			{fieldErrors.password && (
				<p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
			)}
		</div>
	);
}
