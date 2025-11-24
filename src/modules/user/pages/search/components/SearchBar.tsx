"use client";

import { useState } from "react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/common/components/ui/command";

import { useSearchSuggestions } from "../hooks/useSearchSuggestions.hook";

const suggestions = [
	{ label: "Time management", icon: "🗓️" },
	{ label: "Emojis", icon: "😊" },
	{ label: "Math", icon: "📊" },
];

export default function SearchBar() {
	const [open, setOpen] = useState(false);

	const { query, setQuery, results, loading, error } = useSearchSuggestions();

	return (
		<div className="w-full max-w-md mx-auto relative">
			<Command className="rounded-lg border shadow-md">
				<CommandInput
					className="rounded-lg border-none outline-none shadow-none focus:ring-0"
					placeholder="Search for a topic..."
					value={query}
					onValueChange={(value: string) => {
						setQuery(value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 120)}
				/>
				{open && (
					<CommandList className="absolute w-full left-0 top-full mt-2 bg-white border rounded-lg shadow z-10">
						{loading && <CommandEmpty>Loading...</CommandEmpty>}
						{error && <CommandEmpty className="text-red-500">{error}</CommandEmpty>}
						{!loading && !error && (
							<>
								{query.trim() === "" ? (
									<CommandGroup heading="Suggestions">
										{suggestions.map(item => (
											<CommandItem key={item.label} value={item.label}>
												<span className="mr-2">{item.icon}</span>
												{item.label}
											</CommandItem>
										))}
									</CommandGroup>
								) : results.length === 0 ? (
									<CommandEmpty>
										No suggestions found for &quot;<b>{query}</b>&quot;
									</CommandEmpty>
								) : (
									<CommandGroup heading="Suggestions">
										{results.map((item, index) => (
											<CommandItem
												key={`${item.firstName}-${item.lastName}-${item.roleType}-${index}`}
												value={`${item.firstName} ${item.lastName} ${item.roleType}`}
											>
												{item.firstName} {item.lastName} ({item.roleType})
											</CommandItem>
										))}
									</CommandGroup>
								)}
							</>
						)}
					</CommandList>
				)}
			</Command>
		</div>
	);
}
