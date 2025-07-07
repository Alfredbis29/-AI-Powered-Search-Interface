import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { BookCard } from './components/BookCard';
import { fetchBooks } from './utils/books';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    const results = await fetchBooks(query);
    setBooks(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">📚 AI Book Search</h1>
        <SearchBar onSearch={handleSearch} />
        {loading && <p className="mt-4 text-center">Loading books...</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {books.map((book: any) => (
            <BookCard key={book.key} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
