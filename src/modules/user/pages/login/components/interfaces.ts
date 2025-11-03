import type React from "react";

export interface LoginFormData {
	email: string;
	password: string;
}

export interface LoginFieldErrors {
	email?: string;
	password?: string;
}

export interface LoginFormProps {
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	showPassword: boolean;
	setShowPassword: (show: boolean) => void;
	error: string;
	loading: boolean;
	fieldErrors: LoginFieldErrors;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
	clearFieldError: (field: "email" | "password") => void;
}

export interface EmailFieldProps {
	email: string;
	setEmail: (email: string) => void;
	fieldErrors: LoginFieldErrors;
	clearFieldError: (field: "email" | "password") => void;
}

export interface PasswordFieldProps {
	password: string;
	setPassword: (password: string) => void;
	showPassword: boolean;
	setShowPassword: (show: boolean) => void;
	fieldErrors: LoginFieldErrors;
	clearFieldError: (field: "email" | "password") => void;
}

export interface LoginCardProps {
	children: React.ReactNode;
}
