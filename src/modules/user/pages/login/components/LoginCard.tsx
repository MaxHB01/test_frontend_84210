import React from "react";

import { Card, CardContent, CardHeader } from "@/common/components/ui";

import type { LoginCardProps } from "./interfaces";

import styles from "../login.page.module.scss";

export function LoginCard({ children }: LoginCardProps): React.JSX.Element {
	return (
		<div className={styles.wrapper}>
			<Card className="overflow-visible relative w-[450px]">
				<CardHeader className="text-center">
					<h1 className="text-4xl font-bold text-foreground">Welcome</h1>
				</CardHeader>
				<CardContent className="space-y-6">{children}</CardContent>
			</Card>
		</div>
	);
}
