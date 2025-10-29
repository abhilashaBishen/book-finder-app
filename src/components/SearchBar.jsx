// components/SearchBar.jsx

import React, { useRef, useState } from "react";

export function SearchBar({ query, setQuery, onSearch, onReset }) {
	const [listening, setListening] = useState(false);
	const recognitionRef = useRef(null);

	// Initialize SpeechRecognition
	const initSpeechRecognition = () => {
		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) {
			alert("Sorry, your browser doesn't support voice search 😔");
			return null;
		}

		const recognition = new SpeechRecognition();
		recognition.lang = "en-US";
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		recognition.onstart = () => setListening(true);
		recognition.onend = () => setListening(false);
		recognition.onerror = () => setListening(false);

		recognition.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			setQuery(transcript);
			onSearch(); // trigger search immediately
		};

		recognitionRef.current = recognition;
		return recognition;
	};

	const handleVoiceSearch = () => {
		let recognition = recognitionRef.current;
		if (!recognition) {
			recognition = initSpeechRecognition();
		}
		if (recognition) recognition.start();
	};

	return (
		<form
			onSubmit={onSearch}
			className="bg-white p-4 rounded-2xl shadow-sm grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
			<div className="sm:col-span-2 relative">
				<label className="block text-sm font-medium text-gray-700">Title</label>
				<div className="flex items-center mt-1">
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Try: 'Harry Potter', 'Clean Code'..."
						className="block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-200 p-2 pr-10"
					/>
					<button
						type="button"
						onClick={handleVoiceSearch}
						title="Search by voice"
						className={`absolute right-2 p-1.5 rounded-full ${
							listening
								? "bg-red-100 text-red-600"
								: "text-gray-500 hover:text-indigo-600"
						}`}>
						🎤
					</button>
				</div>
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
