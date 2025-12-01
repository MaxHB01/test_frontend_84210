import type { ReactElement } from "react";

import { Card, CardHeader } from "@/common/components/ui";

import { BioForm } from "./components/bio-form";

import styles from "./bio.page.module.scss";

export function BioPage(): ReactElement {
	return (
		<div className={styles.wrapper}>
			<Card className="overflow-visible relative w-[420px]">
				<CardHeader>
					<h1 className="text-2xl font-bold text-foreground">Add Your Bio</h1>
					<p className="text-muted-foreground">
						Share more about your experience so mentees can get to know you better.
					</p>
				</CardHeader>
				<BioForm />
			</Card>
		</div>
	);
}
