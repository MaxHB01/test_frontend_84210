import React from "react";
import { auth } from "@/auth";
import { Navbar } from "@/common/components";

export default async function Home(): Promise<React.JSX.Element> {
	const session = await auth();

	return (
		<div className="min-h-screen bg-[#F5F8FA]">
			<Navbar session={session} />
		</div>
	);
}
