"use client";

import type { ReactElement } from "react";

import { Card, CardHeader } from "@/common/components/ui";

import { TopicForm } from "./components/topic-form";

import styles from "./topic.page.module.scss";

export function TopicPage(): ReactElement {
	const existingTopics: string[] = [];

	const suggestedTopics: string[] = [];

	const handleTopicsChange = (topics: string[]) => {
		void topics; // Placeholder for future database save
	};

	return (
		<div className={styles.wrapper}>
			<Card className="overflow-visible relative w-[350px]">
				<CardHeader>
					<h1 className="text-2xl font-bold text-foreground">Manage Topics</h1>
					<p className="text-muted-foreground">
						Add or remove topics from your profile.
					</p>
				</CardHeader>
				<TopicForm
					existingTopics={existingTopics}
					suggestedTopics={suggestedTopics}
					onTopicsChange={handleTopicsChange}
				/>
			</Card>
		</div>
	);
}

