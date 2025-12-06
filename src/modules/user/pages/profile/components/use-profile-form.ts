import { startTransition, useEffect, useRef, useState } from "react";

import type { ProfileUpdateData } from "../api/dtos.types";

type UseProfileFormReturn = {
	firstName: string;
	lastName: string;
	email: string;
	linkedInProfile: string;
	biography: string;
	topics: string[];
	topicValue: string;
	loading: boolean;
	error: string | null;
	setFirstName: (value: string) => void;
	setLastName: (value: string) => void;
	setEmail: (value: string) => void;
	setLinkedInProfile: (value: string) => void;
	setBiography: (value: string) => void;
	setTopics: (value: string[]) => void;
	setTopicValue: (value: string) => void;
	setLoading: (value: boolean) => void;
	setError: (value: string | null) => void;
};

export function useProfileForm(initialData?: Partial<ProfileUpdateData>): UseProfileFormReturn {
	const prevDataRef = useRef<string>("");

	const [firstName, setFirstName] = useState(initialData?.firstName ?? "");
	const [lastName, setLastName] = useState(initialData?.lastName ?? "");
	const [email, setEmail] = useState(initialData?.email ?? "");
	const [linkedInProfile, setLinkedInProfile] = useState(initialData?.linkedInProfile ?? "");
	const [biography, setBiography] = useState(initialData?.biography ?? "");
	const [topics, setTopics] = useState<string[]>(initialData?.topics ?? []);
	const [topicValue, setTopicValue] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Use startTransition to batch state updates and avoid cascading renders
	useEffect(() => {
		if (!initialData) return;

		const dataKey = JSON.stringify(initialData);
		if (dataKey === prevDataRef.current) return;

		prevDataRef.current = dataKey;
		startTransition(() => {
			setFirstName(initialData.firstName ?? "");
			setLastName(initialData.lastName ?? "");
			setEmail(initialData.email ?? "");
			setLinkedInProfile(initialData.linkedInProfile ?? "");
			setBiography(initialData.biography ?? "");
			setTopics(initialData.topics ?? []);
		});
	}, [initialData]);

	return {
		firstName,
		lastName,
		email,
		linkedInProfile,
		biography,
		topics,
		topicValue,
		loading,
		error,
		setFirstName,
		setLastName,
		setEmail,
		setLinkedInProfile,
		setBiography,
		setTopics,
		setTopicValue,
		setLoading,
		setError,
	};
}
