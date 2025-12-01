"use client";

import { type ReactElement, useState } from "react";

import { Button } from "@/common/components/ui/button";
import { CardContent, CardFooter } from "@/common/components/ui/card";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";

export function BioForm(): ReactElement {
	const [bio, setBio] = useState<string>("");
	const [savedBio, setSavedBio] = useState<string>("");

	const handleSave = () => {
		setSavedBio(bio.trim());
	};

	return (
		<form
			className="contents"
			onSubmit={event => {
				event.preventDefault();
				handleSave();
			}}
		>
			<CardContent className="grid w-full items-center gap-4">
				<div className="grid gap-2">
					<Label htmlFor="mentor-bio">Your mentor bio</Label>
					<Textarea
						id="mentor-bio"
						placeholder="Share your background, expertise, and how you like to mentor."
						value={bio}
						onChange={event => setBio(event.target.value)}
						rows={6}
					/>
					<p className="text-sm text-muted-foreground">
						This bio will appear on your profile to help mentees learn more about you.
					</p>
					<div className="text-right text-xs text-muted-foreground">
						{bio.trim().length} characters
					</div>
				</div>

				{savedBio && (
					<div className="rounded-md bg-[#f9f9f8] p-3 text-sm text-foreground">
						<p className="font-semibold">Preview</p>
						<p className="mt-1 whitespace-pre-wrap">{savedBio}</p>
					</div>
				)}
			</CardContent>

			<CardFooter className="flex flex-col gap-3">
				<Button type="submit" className="w-full" disabled={!bio.trim()}>
					Save Bio
				</Button>
			</CardFooter>
		</form>
	);
}
