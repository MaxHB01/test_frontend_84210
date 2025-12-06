"use client";

import { useRouter } from "next/navigation";

export function useProfileNavigation() {
	const router = useRouter();

	const onProfileClick = (id: string) => {
		router.push(`/profile/${id}`);
	};

	return { onProfileClick };
}
