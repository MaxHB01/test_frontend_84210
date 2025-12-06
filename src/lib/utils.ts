import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
	if (!name?.trim()) return "";

	const words = name.trim().split(/\s+/);
	if (words.length === 0) return "";
	if (words.length === 1) return words[0][0]?.toUpperCase() || "";
	const firstName = words[0];
	const lastName = words[words.length - 1];
	return `${firstName[0]?.toUpperCase() || ""}${lastName[0]?.toUpperCase() || ""}`;
}