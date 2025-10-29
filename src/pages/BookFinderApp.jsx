import React, { useState, useEffect } from "react";
import { useBookSearch } from "../hooks/useBookSearch";
import { SearchBar } from "../components/SearchBar";
import { Filters } from "../components/Filter";
import { BookCard } from "../components/BookCard";
import { Pagination } from "../components/Pagination";

export default function BookFinderApp() {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [authorFilter, setAuthorFilter] = useState("");
	const [yearMin, setYearMin] = useState("");
	const [yearMax, setYearMax] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
		return () => clearTimeout(id);
	}, [query]);

	const { results, numFound, loading, error } = useBookSearch(
		debouncedQuery,
		authorFilter,
		yearMin,
		yearMax,
		page
	);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setDebouncedQuery(query.trim());
		setPage(1);
	};

	const onReset = () => {
		setQuery("");
		setDebouncedQuery("");
		setAuthorFilter("");
		setYearMin("");
		setYearMax("");
		setPage(1);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl sm:text-4xl font-semibold mb-6">
					📚 Book Finder
				</h1>
				<SearchBar
					query={query}
					setQuery={setQuery}
					onSearch={handleSearchSubmit}
					onReset={onReset}
				/>
				<Filters
					authorFilter={authorFilter}
					setAuthorFilter={setAuthorFilter}
					yearMin={yearMin}
					setYearMin={setYearMin}
					yearMax={yearMax}
					setYearMax={setYearMax}
				/>

				<main className="mt-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-medium">Results</h2>
						<div className="text-sm text-gray-600">{numFound} found</div>
					</div>

					{loading && (
						<div className="p-6 text-center bg-white rounded-lg shadow-sm">
							Loading...
						</div>
					)}
					{error && (
						<div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
							Error: {error}
						</div>
					)}
					{!loading && !error && debouncedQuery && results.length === 0 && (
						<div className="p-6 text-center bg-white rounded-lg shadow-sm">
							No results found for \"{debouncedQuery}\"
						</div>
					)}

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
						{results.map((book) => (
							<BookCard key={book.key} book={book} />
						))}
					</div>

					{results.length > 0 && (
						<Pagination
							page={page}
							setPage={setPage}
							hasNext={results.length > 0}
						/>
					)}
				</main>
			</div>
		</div>
	);
}
