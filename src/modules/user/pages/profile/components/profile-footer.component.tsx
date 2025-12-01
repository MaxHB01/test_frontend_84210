import type { ReactElement } from "react";

import { Linkedin, Star } from "lucide-react";

import { CardFooter } from "@/common/components/ui";

type ProfileFooterProps = {
	rating: number;
	url: string;
};

export function ProfileFooter({ rating, url }: ProfileFooterProps): ReactElement {
	return (
		<CardFooter>
			<div className="mt-1 text-primary text-lg font-bold">
				<div className="flex items-center gap-2 pr-7">
					<Star className="h-4 w-4" strokeWidth={2.5} />
					<div>{rating}</div>
				</div>
				<div className=" text-xs text-muted-foreground">Rating</div>
			</div>
			<a href={url}>
				<Linkedin />
			</a>
		</CardFooter>
	);
}
