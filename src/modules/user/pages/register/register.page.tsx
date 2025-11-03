import RegisterForm from "./components/register-form";
import styles from "./register.page.module.scss";
import { Card, CardHeader } from "@/common/components/ui";
import type { ReactElement } from "react";

export function RegisterPage(): ReactElement {
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
