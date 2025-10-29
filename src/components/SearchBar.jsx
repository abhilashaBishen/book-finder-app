// components/SearchBar.jsx
import React from "react";

export function SearchBar({ query, setQuery, onSearch, onReset }) {
	return (
		<form
			onSubmit={onSearch}
			className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
			<div className="sm:col-span-2">
				<label className="block text-sm font-medium text-gray-700">Title</label>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Try: 'Clean Code', 'Algorithms'"
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
					onClick={onReset}
					className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm">
					Reset
				</button>
			</div>
		</form>
	);
}
