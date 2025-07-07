import React, { useState, useEffect } from 'react';
import './App.css';
import BookCard from './components/BookCard';
import SearchBar from './components/SearchBar';

interface Book {
  id: string;
  title: string;
  authors: string[];
  imageLinks?: {
    thumbnail?: string;
  };
  averageRating?: number;
  ratingsCount?: number;
}

const POPULAR_BOOKS = [
  {
    id: '1',
    title: 'It Starts with Us: A Novel',
    authors: ['Colleen Hoover'],
    imageLinks: { thumbnail: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1650623382i/60392503.jpg' },
    averageRating: 4.2,
    ratingsCount: 15420
  },
  {
    id: '2',
    title: 'Fairy Tale',
    authors: ['Stephen King'],
    imageLinks: { thumbnail: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1647355277i/60177435.jpg' },
    averageRating: 4.1,
    ratingsCount: 8934
  },
  {
    id: '3',
    title: 'The Thursday Murder Club',
    authors: ['Richard Osman'],
    imageLinks: { thumbnail: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1590733777i/46000520.jpg' },
    averageRating: 4.3,
    ratingsCount: 12678
  },
  {
    id: '4',
    title: 'Normal People',
    authors: ['Sally Rooney'],
    imageLinks: { thumbnail: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1571423190i/41057294.jpg' },
    averageRating: 4.0,
    ratingsCount: 23456
  }
];

function App() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setShowResults(false);
      return;
    }

    setLoading(true);
    setSearchQuery(query);
    setShowResults(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
      );
      const data = await response.json();
      
      if (data.items) {
        const books: Book[] = data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title || 'Unknown Title',
          authors: item.volumeInfo.authors || ['Unknown Author'],
          imageLinks: item.volumeInfo.imageLinks,
          averageRating: item.volumeInfo.averageRating,
          ratingsCount: item.volumeInfo.ratingsCount
        }));
        setSearchResults(books);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching for books:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="hero-section">
        <h1 className="hero-title">Find your next book to read.</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {!showResults && (
        <div className="content-section">
          <h2 className="section-title">Popular</h2>
          <div className="books-grid">
            {POPULAR_BOOKS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {showResults && (
        <div className="results-section">
          <h2 className="section-title">Results</h2>
          {loading ? (
            <div className="loading">Searching for books...</div>
          ) : searchResults.length > 0 ? (
            <div className="books-grid">
              {searchResults.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              No books found for "{searchQuery}". Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;