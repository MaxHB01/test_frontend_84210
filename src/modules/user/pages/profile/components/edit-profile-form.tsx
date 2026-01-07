"use client";

import type { ReactElement } from "react";

import { CheckCircle2, XCircle } from "lucide-react";

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
	userId: string;
	onSubmit: (
		data: ProfileUpdateData
	) => Promise<{ success: true } | { success: false; error: string }>;
};

export function EditProfileForm({
	isMentor,
	initialData,
	userId,
	onSubmit,
}: EditProfileFormProps): ReactElement {
	const formState = useProfileForm(initialData);
	const handleSubmit = createSubmitHandler(formState, isMentor, userId, onSubmit);

	return (
		<form onSubmit={handleSubmit} className="contents">
			<CardContent className="grid w-full items-center gap-4">
				{formState.success && (
					<div className="rounded-md bg-green-50 border border-green-200 p-4">
						<div className="flex items-start gap-3">
							<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
							<div className="flex-1">
								<p className="text-sm font-medium text-green-800">
									Profile updated successfully! Redirecting...
								</p>
							</div>
						</div>
					</div>
				)}

				{formState.error && (
					<div className="rounded-md bg-red-50 border border-red-200 p-4">
						<div className="flex items-start gap-3">
							<XCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
							<div className="flex-1">
								<p className="text-sm font-medium text-red-800">
									Failed to update profile: {formState.error}
								</p>
							</div>
						</div>
					</div>
				)}

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
					/>
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
