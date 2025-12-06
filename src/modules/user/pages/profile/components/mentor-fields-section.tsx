"use client";

import { type ReactElement } from "react";

import { X } from "lucide-react";

import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";

import type { MentorFieldsSectionProps } from "./mentor-fields.types";
import { TopicSelector } from "./topic-selector";

export function MentorFieldsSection({
	fields,
	handlers,
	suggestedTopics = [],
}: MentorFieldsSectionProps): ReactElement {
	const { linkedInProfile, biography, topics, topicValue } = fields;
	const { setLinkedInProfile, setBiography, setTopics, setTopicValue } = handlers;
	const handleAddTopic = (topic: string) => {
		if (topic && !topics.includes(topic)) {
			setTopics([...topics, topic]);
			setTopicValue("");
		}
	};

	const handleRemoveTopic = (topicToRemove: string) => {
		setTopics(topics.filter(t => t !== topicToRemove));
	};

	return (
		<>
			<div className="grid gap-2">
				<Label htmlFor="linkedInProfile">LinkedIn Profile</Label>
				<Input
					id="linkedInProfile"
					placeholder="https://linkedin.com/profile"
					value={linkedInProfile}
					onChange={e => setLinkedInProfile(e.target.value)}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="biography">Biography</Label>
				<Textarea
					id="biography"
					placeholder="Your Biography"
					value={biography}
					onChange={e => setBiography(e.target.value)}
					rows={6}
				/>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="topics">Topics</Label>
				<TopicSelector
					topicValue={topicValue}
					setTopicValue={setTopicValue}
					existingTopics={topics}
					suggestedTopics={suggestedTopics}
					onAddTopic={handleAddTopic}
				/>

				{topics.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-2">
						{topics.map((topic, index) => (
							<div
								key={`${topic}-${index}`}
								className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f9f9f8] rounded-md text-sm text-foreground"
							>
								<span>{topic}</span>
								<Button
									type="button"
									variant="ghost"
									size="icon-sm"
									onClick={() => handleRemoveTopic(topic)}
									className="ml-1 h-auto w-auto p-0.5 hover:bg-foreground/10"
								>
									<X className="size-3.5" />
								</Button>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
