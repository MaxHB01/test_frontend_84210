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
	setSuccess: (value: boolean) => void;
};

type UpdateResult = { success: true } | { success: false; error: string };

export function createSubmitHandler(
	formState: FormState,
	isMentor: boolean,
	userId: string,
	onSubmit: (data: ProfileUpdateData) => Promise<UpdateResult>
) {
	return (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		formState.setError(null);
		formState.setSuccess(false);
		formState.setLoading(true);

		void (async () => {
			try {
				const result = await onSubmit({
					firstName: formState.firstName.trim(),
					lastName: formState.lastName.trim(),
					email: formState.email.trim(),
					...(isMentor && {
						linkedInProfile: formState.linkedInProfile.trim(),
						biography: formState.biography.trim(),
						topics: formState.topics,
					}),
				});

				formState.setLoading(false);

				if (result.success) {
					formState.setSuccess(true);
					// Redirect after 2 seconds
					setTimeout(() => {
						if (isMentor) {
							window.location.href = `/mentors/${userId}`;
						} else {
							// For non-mentors, redirect to mentors list page
							window.location.href = "/mentors";
						}
					}, 2000);
				} else {
					formState.setError(result.error);
				}
			} catch (err) {
				formState.setLoading(false);
				formState.setError(err instanceof Error ? err.message : "Failed to save profile");
			}
		})();
	};
}
