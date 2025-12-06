export type MentorFieldsState = {
	linkedInProfile: string;
	biography: string;
	topics: string[];
	topicValue: string;
};

export type MentorFieldsHandlers = {
	setLinkedInProfile: (value: string) => void;
	setBiography: (value: string) => void;
	setTopics: (topics: string[]) => void;
	setTopicValue: (value: string) => void;
};

export type MentorFieldsSectionProps = {
	fields: MentorFieldsState;
	handlers: MentorFieldsHandlers;
	suggestedTopics?: string[];
};
