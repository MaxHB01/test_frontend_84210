"use client";

import { type JSX, useState } from "react";

import { SearchInput } from "@/common/components/ui";
import type { Mentor } from "@/common/domain/entities/mentor";
import { getMentors } from "@/modules/mentor/api/actions";

import { MentorList } from "./mentor-list.component";

export function MentorSearchWrapper({
	initialMentors,
	initialTopic,
}: {
	initialMentors: Mentor[];
	initialTopic: string;
}): JSX.Element {
	const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
	const [loading, setLoading] = useState(false);
	const [topic, setTopic] = useState(initialTopic);

	async function handleSubmit(topic: string) {
		setLoading(true);

		try {
			const result = await getMentors(topic);
			setMentors(result);
		} finally {
			setLoading(false);
		}
	}
	return (
		<>
			<div className="mb-14 flex justify-center">
				<SearchInput
					placeholder="Topic"
					value={topic}
					onChange={e => setTopic(e)}
					onSubmit={value => void handleSubmit(value)}
				/>
			</div>

			{loading ? (
				<div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
					Loading mentors…
				</div>
			) : (
				<MentorList mentors={mentors} />
			)}
		</>
	);
}
