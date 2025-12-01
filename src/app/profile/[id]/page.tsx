import { ProfilePage } from "@/modules/user/pages/profile/profile.page";

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = await params;
	return <ProfilePage id={id} />;
}
