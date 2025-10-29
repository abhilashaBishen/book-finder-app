// --------------------
// components/Filters.jsx
import React from "react";

export function Filters({
	authorFilter,
	setAuthorFilter,
	yearMin,
	setYearMin,
	yearMax,
	setYearMax,
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Author
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
	);
}
