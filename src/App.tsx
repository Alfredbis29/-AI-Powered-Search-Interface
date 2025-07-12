import React, { useState } from 'react';
import './App.css';
import BookCard from './components/BookCard';
import SearchBar from './components/SearchBar';

interface Book {
  id: string; // This should be the real Google Books volume ID that i used to fetch book details
  title: string;
  authors: string[];
  imageLinks?: {
    thumbnail?: string;
  };
  averageRating?: number;
  ratingsCount?: number;
  description?: string;
}

const POPULAR_BOOKS: Book[] = [
  {
    id: 'CwJfEAAAQBAJ',
    title: 'It Starts with Us: A Novel',
    authors: ['Colleen Hoover'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/11258170-M.jpg',
    },
    averageRating: 4.2,
    ratingsCount: 15420,
    description: 'A powerful sequel in the It Ends With Us series.',
  },
  {
    id: '7dLGDwAAQBAJ',
    title: 'Fairy Tale',
    authors: ['Stephen King'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/12619088-M.jpg',
    },
    averageRating: 4.1,
    ratingsCount: 8934,
    description: 'A dark fantasy thriller by the master of horror.',
  },
  {
    id: 'PwgOEAAAQBAJ', 
    title: 'The Thursday Murder Club',
    authors: ['Richard Osman'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/8231856-M.jpg',
    },
    averageRating: 4.3,
    ratingsCount: 12678,
    description: 'A witty mystery set in a retirement village.',
  },
  {
    id: 'zN3rDwAAQBAJ',
    title: 'Normal People',
    authors: ['Sally Rooney'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/10301584-M.jpg',
    },
    averageRating: 4.0,
    ratingsCount: 23456,
    description: 'An intimate love story by bestselling author Sally Rooney.',
  },
];

function App() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setSelectedBook(null);

    if (!trimmedQuery) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmedQuery)}&maxResults=20`
      );
      const data = await response.json();

      if (data.items) {
        const books: Book[] = data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title || 'Unknown Title',
          authors: item.volumeInfo.authors || ['Unknown Author'],
          imageLinks: item.volumeInfo.imageLinks,
          averageRating: item.volumeInfo.averageRating,
          ratingsCount: item.volumeInfo.ratingsCount,
          description: item.volumeInfo.description,
        }));
        setSearchResults(books);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
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

      {selectedBook ? (
        <div className="book-detail content-section">
          <button onClick={() => setSelectedBook(null)}>⬅ Back</button>
          <h2 className="section-title">{selectedBook.title}</h2>
          <p><strong>Authors:</strong> {selectedBook.authors.join(', ')}</p>
          {selectedBook.imageLinks?.thumbnail && (
            <img
              src={selectedBook.imageLinks.thumbnail}
              alt={selectedBook.title}
              style={{ maxWidth: '150px', marginBottom: '20px' }}
            />
          )}
          <iframe
            title="Book Preview"
            src={`https://books.google.com/books?id=${selectedBook.id}&printsec=frontcover&output=embed`}
            width="100%"
            height="600px"
            allowFullScreen
          />
          <p style={{ marginTop: '20px' }}>
            <strong>Description:</strong> {selectedBook.description || 'No description available.'}
          </p>
        </div>
      ) : (
        <>
          {!searchQuery && (
            <div className="content-section">
              <h2 className="section-title">Popular Books</h2>
              <div className="books-grid">
                {POPULAR_BOOKS.map((book) => (
                  <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                ))}
              </div>
            </div>
          )}

          {searchQuery && (
            <div className="results-section">
              <h2 className="section-title">Results</h2>
              {loading ? (
                <div className="loading">Searching for books...</div>
              ) : searchResults.length > 0 ? (
                <div className="books-grid">
                  {searchResults.map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  No books found for "{searchQuery}". Try a different search term.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
