import type { ReactElement } from "react";

import { Card } from "@/common/components/ui";
import { ErrorPage } from "@/common/pages/error/error.page";
import { getMentor } from "@/modules/user/pages/profile/api/action";
import { ProfileContent } from "@/modules/user/pages/profile/components/profile-content.component";
import { ProfileFooter } from "@/modules/user/pages/profile/components/profile-footer.component";
import { ProfileHeader } from "@/modules/user/pages/profile/components/profile-header.component";

import styles from "./profile.page.module.scss";

type MentorProfilePageProps = {
	id: string;
};

export async function MentorProfilePage({ id }: MentorProfilePageProps): Promise<ReactElement> {
	const mentor = await getMentor(id);

	if (!mentor) {
		return <ErrorPage />;
	}

	const url = `https://${mentor.linkedInProfileUrl}`;

	return (
		<div className={styles.wrapper}>
			<Card className="overflow-visible relative w-[80%]">
				<ProfileHeader {...mentor} />
				<ProfileContent {...mentor} />
				<ProfileFooter rating={mentor.rating} url={url} />
			</Card>
		</div>
	);
}
