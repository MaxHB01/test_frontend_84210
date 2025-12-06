import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Card, CardHeader } from "@/common/components/ui";
import {
	EditProfileForm,
	getProfileData,
	getSuggestedTopics,
	updateProfileAction,
} from "@/modules/user/pages/profile";
import type { ProfileUpdateData } from "@/modules/user/pages/profile/api/dtos.types";

type EditProfilePageProps = {
	searchParams: Promise<{ id?: string }>;
};

export default async function EditProfilePage({ searchParams }: EditProfilePageProps) {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const { id } = await searchParams;
	const userId = id ?? session.user.id;
	const isMentor = session.user.roles?.includes("Mentor") ?? false;

	const [profileData, suggestedTopics] = await Promise.all([
		getProfileData(userId, isMentor),
		isMentor ? getSuggestedTopics() : Promise.resolve([]),
	]);

	async function handleSubmit(data: ProfileUpdateData) {
		"use server";
		await updateProfileAction(data, userId);
		redirect(`/profile/${userId}`);
	}

	return (
		<div className="min-h-screen bg-[#f5f5f5] p-6">
			<div className="mx-auto max-w-lg">
				<Card className="overflow-visible relative">
					<CardHeader>
						<h1 className="text-center text-2xl font-bold text-foreground">
							Edit Profile
						</h1>
					</CardHeader>
					<EditProfileForm
						isMentor={isMentor}
						initialData={profileData}
						suggestedTopics={suggestedTopics}
						onSubmit={handleSubmit}
					/>
				</Card>
			</div>
		</div>
	);
}
