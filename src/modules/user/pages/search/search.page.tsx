import type { ReactElement } from "react";

import SearchBar from "./components/SearchBar";

export function SearchPage(): ReactElement {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
			<h1 className="mb-8 text-4xl font-bold text-green-800">Search for your topic</h1>
			<SearchBar />
		</div>
	);
}
