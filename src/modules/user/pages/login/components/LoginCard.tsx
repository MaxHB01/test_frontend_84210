import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/common/components/ui";
import type { LoginCardProps } from "./interfaces";

export function LoginCard({ children }: LoginCardProps): React.JSX.Element {
	return (
		<div className="form-wrapper">
			<div className="card-wrapper">
				<Card className="bg-white shadow-lg">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold text-[##064E3B]">
							Welcome
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">{children}</CardContent>
				</Card>
			</div>
		</div>
	);
}
