import type { ReactElement } from "react";
import styles from "./select-role.page.module.scss";
import { SelectRoleForm } from "./components/select-role-form";
import { Card, CardHeader } from "@/common/components/ui";

export function SelectRolePage(): ReactElement {
	return (
		<div className={styles.wrapper}>
			<Card className="overflow-visible relative w-[350px]">
				<CardHeader>
					<h1 className="text-2xl font-bold text-foreground">Welcome</h1>
					<p className="text-muted-foreground">
						Before we can get started please fill in the last piece of information.
					</p>
				</CardHeader>
				<SelectRoleForm />
			</Card>
		</div>
	);
}
