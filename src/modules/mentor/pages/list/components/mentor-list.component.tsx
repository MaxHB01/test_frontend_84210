import type { JSX } from "react";

import type { Mentor } from "@/common/domain/entities/mentor";

import { MentorCard } from "./mentor-card";

export function MentorList({ mentors }: { mentors: Mentor[] }): JSX.Element {
	return (
		<>
			{mentors.length === 0 ? (
				<div className="rounded-xl border bg-white p-10 text-center text-sm text-muted-foreground">
					No mentors to display.
				</div>
			) : (
				<section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{mentors.map(m => (
						<MentorCard key={m.id} mentor={m} />
					))}
				</section>
			)}
		</>
	);
}
