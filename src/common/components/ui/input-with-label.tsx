import React, { type ReactElement } from "react";
import { Label } from "@/common/components/ui/label";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

function InputWithLabel({
	id,
	label,
	value,
	setValue,
	placeholder,
	type,
	showPassword,
	setShow,
	isValid = true,
	notValidText,
	hasTyped = false,
}: {
	id: string;
	label: string;
	value: string;
	setValue: (value: string) => void;
	placeholder?: string;
	type?: string;
	showPassword?: boolean;
	setShow?: React.Dispatch<React.SetStateAction<boolean>>;
	isValid?: boolean;
	notValidText?: string;
	hasTyped?: boolean;
}): ReactElement {
	return (
		<div className="grid gap-2 relative">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				type={type ?? "text"}
				placeholder={placeholder ?? label}
				value={value}
				onChange={e => setValue(e.target.value)}
				className={!isValid ? "border-destructive focus-visible:ring-destructive" : ""}
			/>
			{!isValid && hasTyped && <p className="text-sm text-destructive">{notValidText}</p>}
			{showPassword !== undefined && setShow && (
				<Button
					type="button"
					size="icon-sm"
					variant="ghost"
					className="absolute right-3 top-6"
					onClick={() => {
						setShow((prev: boolean) => !prev);
					}}
				>
					{showPassword ? <EyeOff /> : <Eye />}
				</Button>
			)}
		</div>
	);
}

export { InputWithLabel };
