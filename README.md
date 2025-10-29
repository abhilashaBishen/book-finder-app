# 📚 Book Finder

A simple and elegant **React + Tailwind CSS** application that helps users search for books using the **Open Library API** — with **voice search support** for a hands-free experience.

Built for **Alex**, a college student who wants to quickly find books by title and explore details like author, year, and cover.

---

## 🚀 Features

### 🔍 Core Features

- **Search Books by Title** — uses the Open Library API (`https://openlibrary.org/search.json?title={bookTitle}`)
- **Instant Results Display** — shows cover, title, author, and publication year.
- **Pagination** — navigate easily through multiple result pages.
- **Responsive Design** — works perfectly on mobile, tablet, and desktop.
- **Error Handling** — shows clear messages for no results or network issues.

### 🗣️ Advanced Features

- **Voice Search (🎤)** — search books hands-free using speech recognition.
- **Smooth UI** — Tailwind CSS for a clean and modern design.
- **Reusable Components** — modularized code structure for clarity and scalability.

---

## 🧩 Tech Stack

| Tech                 | Purpose                    |
| -------------------- | -------------------------- |
| **React.js**         | UI and State Management    |
| **Tailwind CSS**     | Styling and responsiveness |
| **Open Library API** | Book data source           |
| **Web Speech API**   | Voice recognition          |

---

## 🏗️ Project Structure

book-finder/
├── src/
│ ├── components/
│ │ ├── SearchBar.tsx # Search input + Voice Search button
│ │ ├── Filters.tsx # (Optional) Future filters for author/year
│ │ ├── BookCard.tsx # Displays individual book info
│ │ ├── Pagination.tsx # Handles next/previous navigation
│ ├── hooks/
│ │ └── useBookSearch.ts # Custom hook for fetching books
│ ├── pages/
│ │ └── BookFinderApp.tsx # Main application logic and layout
│ ├── index.css # Tailwind base styles
│ └── main.tsx # React entry point
├── package.json
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/book-finder.git
cd book-finder

npm install

npm run dev

hen open http://localhost:5174
 in your browser.

🎙️ Voice Search Usage

Click the 🎤 microphone icon in the search bar.

Allow microphone access if prompted.

Speak a book title like:

"The Great Gatsby"

The app will automatically populate the text and fetch results.
```
