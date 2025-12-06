export type MentorProfileDto = {
	firstName: string;
	lastName: string;
	userId: string;
	linkedInProfileUrl: string;
	biography: string;
	topics: string[];
};

export type ProfileUpdateData = {
	firstName: string;
	lastName: string;
	email: string;
	linkedInProfile?: string;
	biography?: string;
	topics?: string[];
};

export type MentorUpdateRequest = {
	linkedInProfileUrl?: string;
	biography?: string;
	topics?: string[];
};

export type UserUpdateRequest = {
	firstName: string;
	lastName: string;
	email: string;
};
