"use client";

import { type ReactElement, useEffect, useState } from "react";

import { CheckCircle2, X, XCircle } from "lucide-react";

import { Button } from "@/common/components/ui/button";

type ProfileMessageBannerProps = {
	success?: string | null;
	error?: string | null;
};

export function ProfileMessageBanner({
	success,
	error,
}: ProfileMessageBannerProps): ReactElement | null {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		// Auto-hide after 5 seconds
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, [success, error]);

	if (!isVisible || (!success && !error)) {
		return null;
	}

	if (success) {
		return (
			<div className="mb-4 rounded-md bg-green-50 border border-green-200 p-4">
				<div className="flex items-start gap-3">
					<CheckCircle2 className="size-5 text-green-600 shrink-0 mt-0.5" />
					<div className="flex-1">
						<p className="text-sm font-medium text-green-800">
							Profile updated successfully!
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => setIsVisible(false)}
						className="h-auto w-auto p-0.5 hover:bg-green-100"
					>
						<X className="size-4 text-green-600" />
					</Button>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4">
				<div className="flex items-start gap-3">
					<XCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
					<div className="flex-1">
						<p className="text-sm font-medium text-red-800">
							Failed to update profile: {error}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => setIsVisible(false)}
						className="h-auto w-auto p-0.5 hover:bg-red-100"
					>
						<X className="size-4 text-red-600" />
					</Button>
				</div>
			</div>
		);
	}

	return null;
}
