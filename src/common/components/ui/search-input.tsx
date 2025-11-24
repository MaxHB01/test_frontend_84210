"use client";

import React from "react";

import { Search } from "lucide-react";

type SearchInputProps = {
	value?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	className?: string;
};

export function SearchInput({
	value,
	placeholder = "Topic",
	onChange,
	onSubmit,
	className = "",
}: SearchInputProps): React.JSX.Element {
	const [internalValue, setInternalValue] = React.useState<string>(value ?? "");
	const inputRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value);
		}
	}, [value]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
		const next = e.target.value;
		if (value === undefined) {
			setInternalValue(next);
		}
		onChange?.(next);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
		if (e.key === "Enter") {
			onSubmit?.(value ?? internalValue);
		}
	}

	return (
		<div
			className={[
				"w-full max-w-3xl",
				"rounded-t-md overflow-hidden bg-white shadow-md ring-1 ring-black/5",
				"flex items-center gap-3 px-5 py-3.5",
				className,
			].join(" ")}
			onClick={() => inputRef.current?.focus()}
		>
			<Search className="h-5 w-5 text-primary" aria-hidden="true" />
			<input
				ref={inputRef}
				type="text"
				value={value ?? internalValue}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className="w-full bg-transparent text-sm text-primary placeholder:text-primary caret-primary focus:outline-none"
				aria-label={placeholder}
			/>
		</div>
	);
}
