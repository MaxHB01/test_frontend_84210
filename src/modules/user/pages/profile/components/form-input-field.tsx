"use client";

import type { ReactElement } from "react";

import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";

type FormInputFieldProps = {
	id: string;
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	required?: boolean;
};

export function FormInputField({
	id,
	label,
	placeholder,
	value,
	onChange,
	type = "text",
	required = false,
}: FormInputFieldProps): ReactElement {
	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={e => onChange(e.target.value)}
				required={required}
			/>
		</div>
	);
}
