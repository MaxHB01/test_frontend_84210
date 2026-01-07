import { MentorProfilePage } from "@/modules/mentor/pages";

export default async function Page({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ success?: string; error?: string }>;
}) {
	const { id } = await params;
	return <MentorProfilePage id={id} searchParams={searchParams} />;
}
