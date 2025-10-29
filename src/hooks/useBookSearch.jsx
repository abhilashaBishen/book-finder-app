// hooks/useBookSearch.js
import { useEffect, useState } from "react";

export function useBookSearch(
	query,
	authorFilter,
	yearMin,
	yearMax,
	page,
	limit = 12
) {
	const [results, setResults] = useState([]);
	const [numFound, setNumFound] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!query) {
			setResults([]);
			setNumFound(0);
			setError(null);
			setLoading(false);
			return;
		}

		const controller = new AbortController();

		async function fetchBooks() {
			setLoading(true);
			setError(null);
			try {
				const encoded = encodeURIComponent(query);
				const res = await fetch(
					`https://openlibrary.org/search.json?title=${encoded}&page=${page}&limit=${limit}`,
					{
						signal: controller.signal,
					}
				);
				if (!res.ok) throw new Error(`Open Library returned ${res.status}`);
				const data = await res.json();

				let docs = data.docs || [];
				if (authorFilter) {
					const af = authorFilter.toLowerCase();
					docs = docs.filter((d) =>
						(d.author_name || []).some((a) => a.toLowerCase().includes(af))
					);
				}
				if (yearMin) {
					const yMin = parseInt(yearMin, 10);
					if (!Number.isNaN(yMin))
						docs = docs.filter((d) => d.first_publish_year >= yMin);
				}
				if (yearMax) {
					const yMax = parseInt(yearMax, 10);
					if (!Number.isNaN(yMax))
						docs = docs.filter((d) => d.first_publish_year <= yMax);
				}

				setResults(docs);
				setNumFound(data.numFound || docs.length);
			} catch (err) {
				if (err.name !== "AbortError") {
					setError(err.message || "Unknown error");
				}
			} finally {
				setLoading(false);
			}
		}

		fetchBooks();
		return () => controller.abort();
	}, [query, authorFilter, yearMin, yearMax, page]);

	return { results, numFound, loading, error };
}
