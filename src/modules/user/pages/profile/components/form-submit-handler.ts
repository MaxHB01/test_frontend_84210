import type { FormEvent } from "react";

import type { ProfileUpdateData } from "../api/dtos.types";

type FormState = {
	firstName: string;
	lastName: string;
	email: string;
	linkedInProfile: string;
	biography: string;
	topics: string[];
	setError: (value: string | null) => void;
	setLoading: (value: boolean) => void;
};

export function createSubmitHandler(
	formState: FormState,
	isMentor: boolean,
	onSubmit: (data: ProfileUpdateData) => Promise<void>
) {
	return (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		formState.setError(null);
		formState.setLoading(true);

		void (async () => {
			try {
				await onSubmit({
					firstName: formState.firstName.trim(),
					lastName: formState.lastName.trim(),
					email: formState.email.trim(),
					...(isMentor && {
						linkedInProfile: formState.linkedInProfile.trim(),
						biography: formState.biography.trim(),
						topics: formState.topics,
					}),
				});
			} catch (err) {
				formState.setError(err instanceof Error ? err.message : "Failed to save profile");
				formState.setLoading(false);
			}
		})();
	};
}
