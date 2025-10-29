// components/Pagination.jsx
import React from "react";

export function Pagination({ page, setPage, hasNext }) {
	return (
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
					disabled={!hasNext}
					className={`px-3 py-1 rounded-md border`}>
					Next
				</button>
			</div>
		</div>
	);
}
