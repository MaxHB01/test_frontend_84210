"use client";

import type { ReactElement } from "react";

import { Button } from "@/common/components/ui/button";
import { CardContent, CardFooter } from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/common/components/ui/select";

import { useSelectRoleForm } from "../hooks/select-role.hook";

export function SelectRoleForm(): ReactElement {
	const {
		selectedRole,
		linkedinUrl,
		canContinue,
		isValidLinkedin,
		setSelectedRole,
		setLinkedinUrl,
		handleSubmit,
		isSubmitting,
		error,
	} = useSelectRoleForm();

	return (
		<form
			onSubmit={event => {
				void handleSubmit(event);
			}}
			className="contents"
		>
			<CardContent className="grid w-full items-center gap-4">
				<SelectRoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

				{selectedRole === "mentor" && (
					<div className="grid gap-2">
						<Label htmlFor="linkedin-profile">LinkedIn Profile</Label>
						<Input
							id="linkedin-profile"
							placeholder="https://linkedin.com/in/username"
							value={linkedinUrl}
							onChange={e => setLinkedinUrl(e.target.value)}
							className={
								!isValidLinkedin
									? "border-destructive focus-visible:ring-destructive"
									: ""
							}
						/>
						{!isValidLinkedin && (
							<p className="text-sm text-destructive">
								Please enter a valid LinkedIn profile URL.
							</p>
						)}
					</div>
				)}
			</CardContent>

			<SelectRoleFormButton
				canContinue={canContinue}
				isSubmitting={isSubmitting}
				error={error}
			/>
		</form>
	);
}

function SelectRoleSelector({
	selectedRole,
	setSelectedRole,
}: {
	selectedRole: "mentor" | "student" | undefined;
	setSelectedRole: (role: "mentor" | "student") => void;
}): ReactElement {
	return (
		<div className="grid gap-2">
			<Label htmlFor="role-selector">I am a</Label>
			<Select
				name="role-selector"
				value={selectedRole}
				onValueChange={role => setSelectedRole(role as "mentor" | "student")}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select your role" />
				</SelectTrigger>
				<SelectContent position="popper" sideOffset={4}>
					<SelectItem value="student">Student</SelectItem>
					<SelectItem value="mentor">Mentor</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function SelectRoleFormButton({
	canContinue,
	isSubmitting,
	error,
}: {
	canContinue: boolean;
	isSubmitting: boolean;
	error: string | null;
}) {
	return (
		<CardFooter className="flex flex-col gap-3">
			{error && <p className="w-full text-sm text-destructive text-center">{error}</p>}
			<Button type="submit" disabled={!canContinue || isSubmitting} className="w-full">
				{isSubmitting ? "Saving..." : "Continue"}
			</Button>
		</CardFooter>
	);
}
