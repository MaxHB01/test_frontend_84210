"use client";

import React from "react";

interface UserEmailDisplayProps {
	email: string;
}

export default function UserEmailDisplay({ email }: UserEmailDisplayProps): React.JSX.Element {
	return <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">{email}</div>;
}
