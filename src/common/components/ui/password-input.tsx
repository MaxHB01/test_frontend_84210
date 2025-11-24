"use client";

import * as React from "react";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "./input";

interface PasswordInputProps extends React.ComponentProps<"input"> {
	showPassword?: boolean;
	onToggleVisibility?: () => void;
}

function PasswordInput({
	className,
	showPassword = false,
	onToggleVisibility,
	...props
}: PasswordInputProps) {
	return (
		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				className={cn("w-full pr-10", className)}
				{...props}
			/>
			<button
				type="button"
				onClick={onToggleVisibility}
				className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#000000] hover:text-gray-600"
			>
				{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
			</button>
		</div>
	);
}

export { PasswordInput };
