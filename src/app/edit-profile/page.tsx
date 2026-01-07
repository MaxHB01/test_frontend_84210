import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button, Card, CardHeader } from "@/common/components/ui";
import { EditProfileForm, getProfileData, updateProfileAction } from "@/modules/user/pages/profile";
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

	const profileData = await getProfileData(userId, isMentor);

	async function handleSubmit(data: ProfileUpdateData) {
		"use server";
		return await updateProfileAction(data, userId);
	}

	return (
		<div className="min-h-screen bg-[#f5f5f5] p-6">
			<div className="mx-auto max-w-lg">
				<Card className="overflow-visible relative">
					<CardHeader>
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="icon" asChild className="hover:bg-accent">
								<Link href={isMentor ? `/mentors/${userId}` : "/mentors"}>
									<ArrowLeft className="size-5" />
								</Link>
							</Button>
							<h1 className="text-center text-2xl font-bold text-foreground flex-1">
								Edit Profile
							</h1>
							<div className="w-9" /> {/* Spacer for alignment */}
						</div>
					</CardHeader>
					<EditProfileForm
						isMentor={isMentor}
						initialData={profileData}
						userId={userId}
						onSubmit={handleSubmit}
					/>
				</Card>
			</div>
		</div>
	);
}
