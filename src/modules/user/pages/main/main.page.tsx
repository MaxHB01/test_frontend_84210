import React from "react";

import { SearchInput } from "@/common/components/ui";

import { MentorCard } from "./components/mentor-card";

export type Mentor = {
	id: number | string;
	name: string;
	initials: string;
	bio: string;
	topics: string[];
	rating: number;
};

export default function MainPage({ mentors = [] }: { mentors?: Mentor[] }): React.JSX.Element {
	return (
		<main className="mx-auto w-full max-w-5xl px-6 py-10">
			<div className="mb-14 flex justify-center">
				<SearchInput placeholder="Topic" />
			</div>

			{mentors.length === 0 ? (
				<div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
					No mentors to display.
				</div>
			) : (
				<section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{mentors.map(m => (
						<MentorCard
							key={m.id}
							name={m.name}
							initials={m.initials}
							bio={m.bio}
							topics={m.topics}
							rating={m.rating}
						/>
					))}
				</section>
			)}
		</main>
	);
}
