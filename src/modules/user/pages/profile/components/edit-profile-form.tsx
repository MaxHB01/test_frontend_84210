"use client";

import type { ReactElement } from "react";

import { Button } from "@/common/components/ui/button";
import { CardContent, CardFooter } from "@/common/components/ui/card";

import type { ProfileUpdateData } from "../api/dtos.types";
import { FormInputField } from "./form-input-field";
import { createSubmitHandler } from "./form-submit-handler";
import { MentorFieldsSection } from "./mentor-fields-section";
import { useProfileForm } from "./use-profile-form";

type EditProfileFormProps = {
	isMentor: boolean;
	initialData?: Partial<ProfileUpdateData>;
	suggestedTopics?: string[];
	onSubmit: (data: ProfileUpdateData) => Promise<void>;
};

export function EditProfileForm({
	isMentor,
	initialData,
	suggestedTopics = [],
	onSubmit,
}: EditProfileFormProps): ReactElement {
	const formState = useProfileForm(initialData);
	const handleSubmit = createSubmitHandler(formState, isMentor, onSubmit);

	return (
		<form onSubmit={handleSubmit} className="contents">
			<CardContent className="grid w-full items-center gap-4">
				<FormInputField
					id="firstName"
					label="First Name"
					placeholder="First Name"
					value={formState.firstName}
					onChange={formState.setFirstName}
					required
				/>

				<FormInputField
					id="lastName"
					label="Last Name"
					placeholder="Last Name"
					value={formState.lastName}
					onChange={formState.setLastName}
					required
				/>

				<FormInputField
					id="email"
					label="Email"
					placeholder="Email"
					type="email"
					value={formState.email}
					onChange={formState.setEmail}
					required
				/>

				{isMentor && (
					<MentorFieldsSection
						fields={{
							linkedInProfile: formState.linkedInProfile,
							biography: formState.biography,
							topics: formState.topics,
							topicValue: formState.topicValue,
						}}
						handlers={{
							setLinkedInProfile: formState.setLinkedInProfile,
							setBiography: formState.setBiography,
							setTopics: formState.setTopics,
							setTopicValue: formState.setTopicValue,
						}}
						suggestedTopics={suggestedTopics}
					/>
				)}

				{formState.error && (
					<div className="text-sm text-destructive">{formState.error}</div>
				)}
			</CardContent>

			<CardFooter>
				<Button type="submit" className="w-full" disabled={formState.loading}>
					{formState.loading ? "Saving..." : "Save Profile"}
				</Button>
			</CardFooter>
		</form>
	);
}
