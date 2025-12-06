import { MentorProfilePage } from "@/modules/mentor/pages";

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = await params;
	return <MentorProfilePage id={id} />;
}
