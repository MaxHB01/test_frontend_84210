"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";


import { X } from "lucide-react";

import { Button } from "@/common/components/ui/button";
import { CardContent, CardFooter } from "@/common/components/ui/card";

import { TopicSelector } from "./topic-selector";
	
type TopicFormProps = {
	suggestedTopics?: string[];
	existingTopics?: string[];
	onTopicsChange?: (topics: string[]) => void;
};

export function TopicForm({
	suggestedTopics = [],
	existingTopics: initialExistingTopics = [],
	onTopicsChange,
}: TopicFormProps): ReactElement {
	const [topicValue, setTopicValue] = useState<string>("");
	const [existingTopics, setExistingTopics] = useState<string[]>(initialExistingTopics);

	// Sync with prop changes from parent (backend data)
	useEffect(() => {
		setExistingTopics(initialExistingTopics);
	}, [initialExistingTopics]);

	// Update local state and notify parent when topics change
	const handleSetExistingTopics = (newTopics: string[]) => {
		setExistingTopics(newTopics);
		if (onTopicsChange) {
			onTopicsChange(newTopics);
		}
	};

	const canAdd = useMemo(() => {
		const trimmed = topicValue.trim();
		if (!trimmed) return false;
		return !existingTopics.includes(trimmed);
	}, [topicValue, existingTopics]);

	return (
		<form className="contents">
			<CardContent className="grid w-full items-center gap-4">
				<TopicSelector
					topicValue={topicValue}
					setTopicValue={setTopicValue}
					existingTopics={existingTopics}
					suggestedTopics={suggestedTopics}
				/>

				{existingTopics.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{existingTopics.map((topic, index) => (
							<div
								key={`${topic}-${index}`}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f9f8] rounded-md text-sm text-foreground"
							>
								<span>{topic}</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => {
										const updatedTopics = existingTopics.filter(t => t !== topic);
										handleSetExistingTopics(updatedTopics);
									}}
									className="ml-1 h-auto w-auto p-0.5 hover:bg-foreground/10"
								>
									<X className="size-3.5" />
								</Button>
							</div>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className="flex flex-col gap-3">
				<Button
					type="button"
					disabled={!canAdd}
					className="w-full"
					onClick={() => {
						if (canAdd && topicValue.trim()) {
							const updatedTopics = [...existingTopics, topicValue.trim()];
							handleSetExistingTopics(updatedTopics);
							setTopicValue("");
						}
					}}
				>
					Add Topic
				</Button>
			</CardFooter>
		</form>
	);
}

