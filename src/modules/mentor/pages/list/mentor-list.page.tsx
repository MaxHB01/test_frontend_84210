"use server";

import { auth } from "@/auth";
import { Navbar } from "@/common/components";

import { getMentors } from "../../api/actions";
import { MentorSearchWrapper } from "./components/mentor-list-wrapper.component";

export async function MentorListPage(props: { searchParams: Promise<{ topic?: string }> }) {
	const { topic } = await props.searchParams;
	const initialTopic = topic ?? "";

	const session = await auth();
	const initialMentors = await getMentors(initialTopic);

	return (
		<>
			<Navbar session={session} />
			<main className="mx-auto w-full max-w-5xl px-6 py-10">
				<MentorSearchWrapper initialTopic={initialTopic} initialMentors={initialMentors} />
			</main>
		</>
	);
}
