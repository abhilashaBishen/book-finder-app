import React, { useState, useEffect } from "react";

/**
 * Book Finder - Single-file React component
 * - Uses Open Library Search API: https://openlibrary.org/search.json?title={bookTitle}
 * - Tailwind CSS classes for styling (assumes Tailwind is configured in the project)
 * - Uses React's built-in state management (useState/useEffect)
 *
 * How to use:
 * 1. Create a React app (Vite / Create React App / Next.js app). Ensure Tailwind CSS is installed and configured.
 * 2. Drop this component into your project (e.g., src/App.jsx) and render it.
 * 3. Start the app and try searching for book titles like "Pride and Prejudice" or "Clean Code".
 *
 * Features included:
 * - Title search with debounce (300ms)
 * - Filters: author name and first publish year (min/max)
 * - Pagination (prev/next) for results
 * - Displays cover image, title, author(s), first publish year, edition count, subjects (if present)
 * - Graceful error handling and empty-state UI
 * - Responsive layout suitable for mobile and desktop
 *
 * Notes:
 * - Open Library returns many results; we request `page` and `limit` using `page` query param via &page={page}
 * - For cover images we use: https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
 */

export default function BookFinderApp() {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [authorFilter, setAuthorFilter] = useState("");
	const [yearMin, setYearMin] = useState("");
	const [yearMax, setYearMax] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [numFound, setNumFound] = useState(0);
	const limit = 12; // results per page

	// For debouncing user input (300ms)
	useEffect(() => {
		const id = setTimeout(() => setDebouncedQuery(query.trim()), 300);
		return () => clearTimeout(id);
	}, [query]);

	// Fetch whenever debouncedQuery, filters, or page change
	useEffect(() => {
		// If no title query, clear results
		if (!debouncedQuery) {
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
				const encoded = encodeURIComponent(debouncedQuery);
				const url = `https://openlibrary.org/search.json?title=${encoded}&page=${page}&limit=${limit}`;
				const res = await fetch(url, { signal: controller.signal });
				if (!res.ok) throw new Error(`Open Library returned ${res.status}`);
				const data = await res.json();

				// Convert and filter results by author/year if user supplied filters
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
				if (err.name === "AbortError") return; // ignore
				console.error(err);
				setError(err.message || "Unknown error");
				setResults([]);
				setNumFound(0);
			} finally {
				setLoading(false);
			}
		}

		fetchBooks();

		return () => controller.abort();
	}, [debouncedQuery, authorFilter, yearMin, yearMax, page]);

	// Helpers
	const handleSearchSubmit = (e) => {
		e?.preventDefault();
		// setDebouncedQuery(query.trim()); // debounce will sync soon; but if user explicitly submits, force it
		setDebouncedQuery(query.trim());
		setPage(1);
	};

	const clearFilters = () => {
		setAuthorFilter("");
		setYearMin("");
		setYearMax("");
	};

	const coverUrl = (cover_i) =>
		cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : null;

	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				<header className="mb-6">
					<h1 className="text-3xl sm:text-4xl font-semibold">📚 Book Finder</h1>
					<p className="text-gray-600 mt-1">
						Search books by title, filter by author or year — powered by Open
						Library.
					</p>
				</header>

				<form
					onSubmit={handleSearchSubmit}
					className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
					<div className="sm:col-span-2">
						<label className="block text-sm font-medium text-gray-700">
							Title
						</label>
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Try: 'To Kill a Mockingbird', 'Algorithms', 'Design Patterns'"
							className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
						/>
					</div>

					<div className="flex gap-2">
						<button
							type="submit"
							className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700">
							Search
						</button>
						<button
							type="button"
							onClick={() => {
								setQuery("");
								setDebouncedQuery("");
								setPage(1);
								clearFilters();
							}}
							className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm">
							Reset
						</button>
					</div>

					{/* Filters row - spans full width under inputs on small screens */}
					<div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Author (contains)
							</label>
							<input
								value={authorFilter}
								onChange={(e) => setAuthorFilter(e.target.value)}
								placeholder="e.g., Orwell"
								className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Year min
							</label>
							<input
								value={yearMin}
								onChange={(e) => setYearMin(e.target.value)}
								placeholder="e.g., 1950"
								inputMode="numeric"
								className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Year max
							</label>
							<input
								value={yearMax}
								onChange={(e) => setYearMax(e.target.value)}
								placeholder="e.g., 2020"
								inputMode="numeric"
								className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2"
							/>
						</div>
					</div>
				</form>

				<main className="mt-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-medium">Results</h2>
						<div className="text-sm text-gray-600">{numFound} found</div>
					</div>

					<div className="mt-4">
						{loading && (
							<div className="p-6 text-center bg-white rounded-lg shadow-sm">
								Loading results...
							</div>
						)}

						{error && (
							<div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
								Error: {error}
							</div>
						)}

						{!loading && !error && debouncedQuery && results.length === 0 && (
							<div className="p-6 text-center bg-white rounded-lg shadow-sm">
								No results found for "{debouncedQuery}" with the current
								filters.
							</div>
						)}

						{!debouncedQuery && (
							<div className="p-6 text-center bg-white rounded-lg shadow-sm">
								Try searching for a book title above.
							</div>
						)}

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
							{results.map((book) => (
								<article
									key={`${book.key}-${book.cover_i || "nocover"}`}
									className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
									<div className="w-24 flex-shrink-0">
										{book.cover_i ? (
											<img
												src={coverUrl(book.cover_i)}
												alt={`Cover for ${book.title}`}
												className="w-24 h-32 object-cover rounded-md"
											/>
										) : (
											<div className="w-24 h-32 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500">
												No cover
											</div>
										)}
									</div>

									<div className="flex-1">
										<h3 className="font-semibold text-sm line-clamp-2">
											{book.title}
										</h3>
										<div className="text-xs text-gray-600 mt-1">
											{(book.author_name || []).join(", ")}
										</div>
										<div className="mt-2 text-xs text-gray-600">
											<div>
												First published: {book.first_publish_year ?? "—"}
											</div>
											<div>Edition count: {book.edition_count ?? "—"}</div>
										</div>

										{book.subject && book.subject.length > 0 && (
											<div className="mt-3 flex gap-2 flex-wrap">
												{book.subject.slice(0, 6).map((s) => (
													<span
														key={s}
														className="text-[10px] px-2 py-1 bg-indigo-50 rounded-full border border-indigo-100">
														{s}
													</span>
												))}
											</div>
										)}

										<div className="mt-3 flex gap-2">
											<a
												href={`https://openlibrary.org${book.key}`}
												target="_blank"
												rel="noreferrer"
												className="text-xs font-medium underline">
												View on Open Library
											</a>
										</div>
									</div>
								</article>
							))}
						</div>

						{/* Pagination */}
						{!loading && results.length > 0 && (
							<div className="mt-6 flex items-center justify-between">
								<div className="text-sm text-gray-600">Page {page}</div>
								<div className="flex gap-2">
									<button
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
										className={`px-3 py-1 rounded-md border ${
											page === 1 ? "opacity-50 cursor-not-allowed" : ""
										}`}>
										Prev
									</button>

									<button
										onClick={() => setPage((p) => p + 1)}
										className={`px-3 py-1 rounded-md border`}>
										Next
									</button>
								</div>
							</div>
						)}
					</div>
				</main>

				<footer className="mt-8 text-center text-sm text-gray-500">
					Built for Alex • Data from Open Library • Tip: try searching for
					course textbooks or authors you like.
				</footer>
			</div>
		</div>
	);
}
