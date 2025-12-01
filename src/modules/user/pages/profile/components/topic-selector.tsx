"use client";

import { type ReactElement, useMemo, useState } from "react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/common/components/ui/command";
import { Label } from "@/common/components/ui/label";

type TopicSelectorProps = {
	topicValue: string;
	setTopicValue: (value: string) => void;
	existingTopics: string[];
	suggestedTopics?: string[];
};

export function TopicSelector({
	topicValue,
	setTopicValue,
	existingTopics,
	suggestedTopics = [],
}: TopicSelectorProps): ReactElement {
	const [open, setOpen] = useState(false);

	const filteredSuggestions = useMemo(() => {
		const available = suggestedTopics.filter(topic => !existingTopics.includes(topic));

		if (!topicValue.trim()) {
			return available;
		}

		const searchLower = topicValue.toLowerCase();
		return available.filter(topic => topic.toLowerCase().includes(searchLower));
	}, [suggestedTopics, existingTopics, topicValue]);

	const isDuplicate = existingTopics.includes(topicValue.trim());

	return (
		<div className="grid gap-2">
			<Label htmlFor="topic-input">Add Topic</Label>
			<div className="relative w-full">
				<Command
					className={`rounded-lg border shadow-sm focus-within:ring-0 focus-within:outline-none ${
						isDuplicate && topicValue.trim().length > 0 ? "border-destructive" : ""
					} [&_[data-slot=command-input-wrapper]]:focus-within:border-0 [&_[data-slot=command-input-wrapper]]:focus-within:border-none`}
				>
					<CommandInput
						id="topic-input"
						placeholder="Type a topic or select from suggestions..."
						value={topicValue}
						onValueChange={(value: string) => {
							setTopicValue(value);
							setOpen(true);
						}}
						onFocus={() => setOpen(true)}
						onBlur={() => setTimeout(() => setOpen(false), 200)}
						hideBorder
						hideIcon
						className="border-none shadow-none focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none focus:border-0 focus-visible:border-0"
					/>
					{open && filteredSuggestions.length > 0 && (
						<CommandList className="absolute w-full left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-[200px]">
							<CommandGroup heading="Suggestions">
								{filteredSuggestions.map(suggestion => (
									<CommandItem
										key={suggestion}
										value={suggestion}
										onSelect={() => {
											setTopicValue(suggestion);
											setOpen(false);
										}}
									>
										{suggestion}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					)}
					{open && topicValue.trim() && filteredSuggestions.length === 0 && (
						<CommandList className="absolute w-full left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
							<CommandEmpty>
								No suggestions found for &quot;<b>{topicValue}</b>&quot;
							</CommandEmpty>
						</CommandList>
					)}
				</Command>
			</div>
			{isDuplicate && topicValue.trim().length > 0 && (
				<p className="text-sm text-destructive">This topic is already added.</p>
			)}
		</div>
	);
}
