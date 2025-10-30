// components/BookCard.jsx
import React from "react";

export function BookCard({ book }) {
	const fallbackImage =
		"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=150&q=80";

	const coverUrl = (cover_i) =>
		cover_i
			? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
			: fallbackImage;

	return (
		<article className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
			<div className="w-24 flex-shrink-0">
				<img
					src={coverUrl(book.cover_i)}
					alt={`Cover for ${book.title}`}
					className="w-24 h-32 object-cover rounded-md"
					onError={(e) => {
						if (e.target.src !== fallbackImage) {
							e.target.src = fallbackImage;
						}
					}}
				/>
			</div>
			<div className="flex-1">
				<h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
				<div className="text-xs text-gray-600 mt-1">
					{(book.author_name || []).join(", ")}
				</div>
				<div className="mt-2 text-xs text-gray-600">
					<div>First published: {book.first_publish_year ?? "—"}</div>
					<div>Edition count: {book.edition_count ?? "—"}</div>
				</div>
			</div>
		</article>
	);
}
