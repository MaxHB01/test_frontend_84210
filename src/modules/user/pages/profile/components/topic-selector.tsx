"use client";

import { type KeyboardEvent, type ReactElement, useEffect, useMemo, useState } from "react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/common/components/ui/command";

import { searchTopics } from "../api/search-topics.action";

type TopicSelectorProps = {
	topicValue: string;
	setTopicValue: (value: string) => void;
	existingTopics: string[];
	suggestedTopics?: string[];
	onAddTopic?: (topic: string) => void;
};

function TopicCommandInput({
	topicValue,
	setTopicValue,
	isDuplicate,
	onAddTopic,
	setOpen,
}: {
	topicValue: string;
	setTopicValue: (value: string) => void;
	isDuplicate: boolean;
	onAddTopic?: (topic: string) => void;
	setOpen: (open: boolean) => void;
}): ReactElement {
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && topicValue.trim() && !isDuplicate && onAddTopic) {
			e.preventDefault();
			onAddTopic(topicValue.trim());
			setTopicValue("");
			setOpen(false);
		}
	};

	return (
		<CommandInput
			id="topic-input"
			placeholder="Type a topic or select from suggestions..."
			value={topicValue}
			onValueChange={(value: string) => {
				setTopicValue(value);
				setOpen(true);
			}}
			onKeyDown={handleKeyDown}
			onFocus={() => setOpen(true)}
			onBlur={() => setTimeout(() => setOpen(false), 200)}
			hideBorder
			hideIcon
			className="border-none shadow-none focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none focus:border-0 focus-visible:border-0"
		/>
	);
}

function TopicSuggestionsList({
	filteredSuggestions,
	onAddTopic,
	setTopicValue,
	setOpen,
}: {
	filteredSuggestions: string[];
	onAddTopic?: (topic: string) => void;
	setTopicValue: (value: string) => void;
	setOpen: (open: boolean) => void;
}): ReactElement {
	return (
		<CommandList className="absolute w-full left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-[200px]">
			<CommandGroup heading="Suggestions">
				{filteredSuggestions.map(suggestion => (
					<CommandItem
						key={suggestion}
						value={suggestion}
						onSelect={() => {
							if (onAddTopic) {
								onAddTopic(suggestion);
								setTopicValue("");
							} else {
								setTopicValue(suggestion);
							}
							setOpen(false);
						}}
					>
						{suggestion}
					</CommandItem>
				))}
			</CommandGroup>
		</CommandList>
	);
}

function TopicEmptyState({ topicValue }: { topicValue: string }): ReactElement {
	return (
		<CommandList className="absolute w-full left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
			<CommandEmpty>
				No suggestions found for &quot;<b>{topicValue}</b>&quot;
			</CommandEmpty>
		</CommandList>
	);
}

export function TopicSelector({
	topicValue,
	setTopicValue,
	existingTopics,
	suggestedTopics = [],
	onAddTopic,
}: TopicSelectorProps): ReactElement {
	const [open, setOpen] = useState(false);
	const [searchedTopics, setSearchedTopics] = useState<string[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// Debounced search for topics
	useEffect(() => {
		if (!topicValue.trim()) {
			setSearchedTopics([]);
			return;
		}

		const timeoutId = setTimeout(() => {
			void (async () => {
				setIsSearching(true);
				try {
					const results = await searchTopics(topicValue);
					setSearchedTopics(results);
				} catch {
					setSearchedTopics([]);
				} finally {
					setIsSearching(false);
				}
			})();
		}, 300); // 300ms debounce

		return () => clearTimeout(timeoutId);
	}, [topicValue]);

	const filteredSuggestions = useMemo(() => {
		// Use searched topics if available, otherwise fall back to static suggested topics
		const topicsToUse = searchedTopics.length > 0 ? searchedTopics : suggestedTopics;
		const available = topicsToUse.filter(topic => !existingTopics.includes(topic));

		if (!topicValue.trim()) {
			return available;
		}

		// If we have searched topics, return them directly (they're already filtered by the API)
		if (searchedTopics.length > 0) {
			return available;
		}

		// Otherwise, filter the static suggestions client-side
		const searchLower = topicValue.toLowerCase();
		return available.filter(topic => topic.toLowerCase().includes(searchLower));
	}, [searchedTopics, suggestedTopics, existingTopics, topicValue]);

	const isDuplicate = existingTopics.includes(topicValue.trim());

	return (
		<div className="grid gap-2">
			<div className="relative w-full">
				<Command
					className={`rounded-lg border shadow-sm focus-within:ring-0 focus-within:outline-none ${
						isDuplicate && topicValue.trim().length > 0 ? "border-destructive" : ""
					} [&_[data-slot=command-input-wrapper]]:focus-within:border-0 [&_[data-slot=command-input-wrapper]]:focus-within:border-none`}
				>
					<TopicCommandInput
						topicValue={topicValue}
						setTopicValue={setTopicValue}
						isDuplicate={isDuplicate}
						onAddTopic={onAddTopic}
						setOpen={setOpen}
					/>
					{open && filteredSuggestions.length > 0 && (
						<TopicSuggestionsList
							filteredSuggestions={filteredSuggestions}
							onAddTopic={onAddTopic}
							setTopicValue={setTopicValue}
							setOpen={setOpen}
						/>
					)}
					{open &&
						topicValue.trim() &&
						filteredSuggestions.length === 0 &&
						!isSearching && <TopicEmptyState topicValue={topicValue} />}
					{open && isSearching && (
						<CommandList className="absolute w-full left-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10">
							<CommandEmpty>Searching topics...</CommandEmpty>
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
