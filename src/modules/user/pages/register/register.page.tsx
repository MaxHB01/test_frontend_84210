"use server";

import React from "react";

import { Card, CardHeader } from "@/common/components/ui";

import RegisterForm from "./components/register-form";

import styles from "./register.page.module.scss";

// eslint-disable-next-line @typescript-eslint/require-await
export async function RegisterPage(): Promise<React.JSX.Element> {
	return (
		<div className={styles.wrapper}>
			<Card className="overflow-visible relative w-[450px]">
				<CardHeader className="text-center">
					<h1 className="text-4xl font-bold text-foreground">Welcome</h1>
				</CardHeader>
				<RegisterForm />
			</Card>
		</div>
	);
}
