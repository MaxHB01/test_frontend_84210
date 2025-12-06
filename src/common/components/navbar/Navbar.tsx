import React from "react";

import Link from "next/link";

import { Button } from "@/common/components/ui";

import UserMenu from "./components/UserMenu";

interface NavbarProps {
	session?: {
		user?: {
			id?: string;
			email?: string;
		};
	} | null;
}

export default function Navbar({ session }: NavbarProps): React.JSX.Element {
	return (
		<header className="bg-white shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center">
						<h1 className="text-xl font-bold text-gray-900">GrowPath</h1>
					</div>
					<div className="flex items-center space-x-4">
						{session ? (
							<UserMenu userId={session.user?.id} userEmail={session.user?.email} />
						) : (
							<>
								<Link href="/auth/login">
									<Button variant={"default"} size={"lg"}>
										Sign In
									</Button>
								</Link>
								<Link href="/auth/register">
									<Button variant={"outline"} size={"lg"}>
										Sign Up
									</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
