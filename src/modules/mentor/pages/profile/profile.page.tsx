import type { ReactElement } from "react";

import { auth } from "@/auth";
import { Card } from "@/common/components/ui";
import { ErrorPage } from "@/common/pages/error/error.page";
import { ProfileSession } from "@/modules/mentor/pages/profile/components/profile-session.component";
import { getMentor } from "@/modules/user/pages/profile/api/action";
import { ProfileContent } from "@/modules/user/pages/profile/components/profile-content.component";
import { ProfileFooter } from "@/modules/user/pages/profile/components/profile-footer.component";
import { ProfileHeader } from "@/modules/user/pages/profile/components/profile-header.component";
import { ProfileMessageBanner } from "@/modules/user/pages/profile/components/profile-message-banner";

import styles from "./profile.page.module.scss";

type MentorProfilePageProps = {
	id: string;
	searchParams?: Promise<{ success?: string; error?: string }>;
};

type ProfileSessionProps = {
	id: string;
	date: Date;
	title: string;
	description: string;
	ownProfile: boolean;
	enrolled?: boolean;
};

export async function MentorProfilePage({
	id,
	searchParams,
}: MentorProfilePageProps): Promise<ReactElement> {
	const mentor = await getMentor(id);
	const session = await auth();

	//TODO: add actual data through api call and remove from here till next comment
	const date = new Date();
	let date2 = new Date();
	date2.setDate(date2.getDate() + 1);
	let date3 = new Date();
	date3.setDate(date3.getDate() + 10);
	const sessions: ProfileSessionProps[] = [
		{
			id: "e35376cd-702d-4644-a0a4-69a47846b140",
			date,
			title: "Mijn allereerste sessie!",
			description: "We gaan het hebben over C#",
			ownProfile: false,
			enrolled: true,
		},
		{
			id: "df3547a7-ba60-4712-84e1-5b770c29e82a",
			date: date2,
			title: "Mijn tweede sessie!",
			description: "We gaan het hebben over C#",
			ownProfile: true,
			enrolled: false,
		},
		{
			id: "e0ba8ccc-ba84-4928-b4bf-b6280c85c766",
			date: date3,
			title: "Mijn derde sessie!",
			description: "We gaan het hebben over C#",
			ownProfile: false,
			enrolled: false,
		},
	];
	//Remove till here

	if (!mentor) {
		return <ErrorPage />;
	}

	const params = searchParams ? await searchParams : {};
	const url = `https://${mentor.linkedInProfileUrl}`;

	return (
		<div className={styles.wrapper}>
			<Card className="overflow-visible relative w-[80%]">
				<ProfileMessageBanner
					success={params.success || null}
					error={params.error ? decodeURIComponent(params.error) : null}
				/>
				<ProfileHeader mentor={mentor} session={session} />
				<ProfileContent {...mentor} />
				<ProfileFooter rating={mentor.rating} url={url} />
			</Card>
			<div className="overflow-visible relative w-[80%]">
				<h2 className="pb-5">Upcoming sessions</h2>
				{sessions.map(s => (
					<ProfileSession
						key={s.id}
						date={s.date}
						title={s.title}
						description={s.description}
						ownProfile={s.ownProfile}
						enrolled={s.enrolled}
					/>
				))}
				{sessions.length <= 0 && <p>No sessions planned yet.</p>}
			</div>
		</div>
	);
}
