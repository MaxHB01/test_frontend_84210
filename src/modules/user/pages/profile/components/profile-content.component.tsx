import type { ReactElement } from "react";

import { CardContent } from "@/common/components/ui";
import type { Mentor } from "@/common/domain/entities/mentor";
import styles from "@/modules/user/pages/profile/profile.page.module.scss";

export function ProfileContent(mentor: Mentor): ReactElement {
	return (
		<CardContent>
			<p className="text-xl">{mentor.bio}</p>
			{mentor.topics.length === 0 ? (
				<p>No topics yet</p>
			) : (
				<div className="flex">
					{mentor.topics.map(topic => (
						<p key={topic} className={"p-1 m-1 rounded-md " + styles.topicCard}>
							{topic}
						</p>
					))}
				</div>
			)}
		</CardContent>
	);
}
