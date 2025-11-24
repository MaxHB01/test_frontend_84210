import { useEffect, useState } from "react";

import { postData } from "@/lib/axios/axios.api";

function useDebouncedValue<T>(value: T, delay: number): T {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(handler);
	}, [value, delay]);
	return debounced;
}

export interface SearchResult {
	firstName: string;
	lastName: string;
	roleType: string;
}

export function useSearchSuggestions(): {
	query: string;
	setQuery: (value: string) => void;
	results: SearchResult[];
	loading: boolean;
	error: string | null;
} {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const debouncedQuery = useDebouncedValue(query, 300);

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (!debouncedQuery.trim()) {
				setResults([]);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const data = await postData<SearchResult[]>("/api/user/search", {
					query: debouncedQuery,
				});

				setResults(data);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message ?? "Unknown error");
				} else {
					setError("Unknown error");
				}
				setResults([]);
			} finally {
				setLoading(false);
			}
		};

		void fetchSuggestions();
	}, [debouncedQuery]);

	return {
		query,
		setQuery,
		results,
		loading,
		error,
	};
}
