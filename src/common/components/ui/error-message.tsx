import React from "react";

import { AlertCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface ErrorMessageProps {
	message: string;
	className?: string;
	variant?: "error" | "warning" | "info";
}

export function ErrorMessage({ message, className, variant = "error" }: ErrorMessageProps) {
	const variantStyles = {
		error: "bg-red-50 border-red-200 text-red-700",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
		info: "bg-blue-50 border-blue-200 text-blue-700",
	};

	const icons = {
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info,
	};

	const Icon = icons[variant];

	return (
		<div
			className={cn(
				"p-3 border rounded-md text-sm flex items-center space-x-2",
				variantStyles[variant],
				className
			)}
		>
			<Icon className="w-4 h-4 flex-shrink-0" />
			<span>{message}</span>
		</div>
	);
}
