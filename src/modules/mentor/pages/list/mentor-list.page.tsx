"use server";

import { getMentors } from "../../api/actions";
import { MentorSearchWrapper } from "./components/mentor-list-wrapper.component";

export async function MentorListPage(props: { searchParams: Promise<{ topic?: string }> }) {
	const { topic } = await props.searchParams;
	const initialTopic = topic ?? "";

	const initialMentors = await getMentors(initialTopic);

	return (
		<main className="mx-auto w-full max-w-5xl px-6 py-10">
			<MentorSearchWrapper initialTopic={initialTopic} initialMentors={initialMentors} />
		</main>
	);
}
