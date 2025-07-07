import { useState } from 'react';
import { Hero } from './components/Hero';
import { BookCarousel } from './components/BookCarousel';

export default function App() {
  const [books, setBooks] = useState<any[]>([]);

  const fetchBooks = async (query: string) => {
    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=10`
    );
    const data = await res.json();
    setBooks(data.docs);
  };

  return (
    <div className="bg-white min-h-screen">
      <Hero onSearch={fetchBooks} />
      {books.length > 0 && <BookCarousel books={books} title="Search Results" />}
    </div>
  );
}
