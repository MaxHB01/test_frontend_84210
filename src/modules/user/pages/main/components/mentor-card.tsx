import React from "react";

import { Star } from "lucide-react";

import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/common/components/ui";

type MentorCardProps = {
	name: string;
	initials: string;
	bio: string;
	topics: string[];
	rating: number;
	onProfile?: () => void;
};

export function MentorCard({
	name,
	initials,
	bio,
	topics,
	rating,
	onProfile,
}: MentorCardProps): React.JSX.Element {
	return (
		<Card className="h-full rounded-xl border-2 border-[#ececec]">
			<CardHeader className="text-left">
				<div className="flex flex-col items-start gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e2e8f1] text-foreground/80 border">
						{initials}
					</div>
					<CardTitle className="text-primary text-lg md:text-xl">{name}</CardTitle>
					<CardDescription className="max-w-prose">{bio}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="flex grow flex-col space-y-4">
				<div className="flex flex-wrap gap-2">
					{topics.map(t => (
						<span
							key={t}
							className="rounded bg-[#f9f9f8] px-2.5 py-1 text-xs text-foreground"
						>
							{t}
						</span>
					))}
				</div>
				<div className="mt-1 text-primary">
					<div className="flex items-center gap-2">
						<Star className="h-4 w-4" strokeWidth={2.5} />
						<div className="font-semibold">{rating.toFixed(1)}</div>
					</div>
					<div className="ml-6 text-xs text-muted-foreground">Rating</div>
				</div>
			</CardContent>
			<CardFooter className="mt-auto">
				<Button onClick={onProfile} size="sm">
					See profile
				</Button>
			</CardFooter>
		</Card>
	);
}
