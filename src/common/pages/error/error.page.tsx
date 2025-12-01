"use client";
import type { ReactElement } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/common/components/ui";

export function ErrorPage(): ReactElement {
	const router = useRouter();

	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-10">
			<div className="mb-14 text-center flex flex-col justify-center">
				<h1>Something went wrong!</h1>
				<Button
					onClick={() => {
						router.back();
					}}
				>
					Go back
				</Button>
			</div>
		</div>
	);
}
