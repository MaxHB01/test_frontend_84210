import { Calendar, Pencil, X } from "lucide-react";

import { Button, Card, CardContent, CardFooter, CardHeader } from "@/common/components/ui";

type ProfileSessionProps = {
	date: Date;
	title: string;
	description: string;
	ownProfile: boolean;
	enrolled?: boolean;
};

export function ProfileSession({
	date,
	title,
	description,
	ownProfile,
	enrolled = false,
}: ProfileSessionProps) {
	const formatted = date
		.toLocaleString("en-GB", {
			weekday: "short",
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		})
		.replace(/,/g, "");

	return (
		<Card className="flex flex-row mb-5 text-black">
			<CardHeader className="flex flex-col items-center">
				<h3 className="text-4xl">{date.getDate()}</h3>
				<p>{date.toLocaleString("en-US", { month: "short" })}</p>
			</CardHeader>
			<CardContent className="flex-1">
				<h3 className="font-bold">{title}</h3>
				<p>{description}</p>
				<p className="flex gap-2 pt-2 pb-2 font-bold text-xs items-center">
					<Calendar className="size-3"></Calendar>
					{formatted}
				</p>
			</CardContent>
			<CardFooter className="flex gap-2 it">
				{ownProfile && (
					<>
						<Button variant="secondary">
							<X /> Cancel
						</Button>
						<Button>
							<Pencil /> Edit
						</Button>
					</>
				)}
				{!ownProfile &&
					(enrolled ? (
						<Button variant="disabled">Enrolled</Button>
					) : (
						<Button>Enroll</Button>
					))}
			</CardFooter>
		</Card>
	);
}
