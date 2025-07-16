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
  description?: string;
  pdfUrl?: string;
}

const POPULAR_BOOKS: Book[] = [
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    authors: ['Mary Shelley'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/8778645-M.jpg',
    },
    averageRating: 4.1,
    ratingsCount: 8934,
    description: 'A gothic horror novel by Mary Shelley.',
    pdfUrl: 'https://archive.org/download/frankenstein1818_202008/Frankenstein_1818.pdf',
  },
  {
    id: 'pride-prejudice',
    title: 'Pride and Prejudice',
    authors: ['Jane Austen'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/10507352-M.jpg',
    },
    averageRating: 4.5,
    ratingsCount: 15420,
    description: 'A classic romantic novel by Jane Austen.',
    pdfUrl: 'https://archive.org/download/prideprejudice00aust_7/PridePrejudice-JaneAusten.pdf',
  },
  {
    id: 'sherlock',
    title: 'The Adventures of Sherlock Holmes',
    authors: ['Arthur Conan Doyle'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/8231996-M.jpg',
    },
    averageRating: 4.4,
    ratingsCount: 12678,
    description: 'Detective stories featuring Sherlock Holmes.',
    pdfUrl: 'https://archive.org/download/adventuresofsher00doylrich/adventuresofsher00doylrich.pdf',
  },
  {
    id: 'moby-dick',
    title: 'Moby-Dick',
    authors: ['Herman Melville'],
    imageLinks: {
      thumbnail: 'https://covers.openlibrary.org/b/id/10521242-M.jpg',
    },
    averageRating: 3.9,
    ratingsCount: 23456,
    description: 'A novel of revenge and obsession at sea.',
    pdfUrl: 'https://archive.org/download/mobydickorwhitew00melvuoft/mobydickorwhitew00melvuoft.pdf',
  },
];

function App() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [pdfAvailability, setPdfAvailability] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Check if pdfUrl is reachable by fetching HEAD
  const checkPdfAvailability = async (book: Book) => {
    if (!book.pdfUrl) {
      setPdfAvailability((prev) => ({ ...prev, [book.id]: false }));
      return;
    }
    try {
      const response = await fetch(book.pdfUrl, { method: 'HEAD' });
      setPdfAvailability((prev) => ({ ...prev, [book.id]: response.ok }));
    } catch {
      setPdfAvailability((prev) => ({ ...prev, [book.id]: false }));
    }
  };

  useEffect(() => {
    // Check availability for popular books
    POPULAR_BOOKS.forEach((book) => {
      checkPdfAvailability(book);
    });
  }, []);

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
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          trimmedQuery
        )}&maxResults=20`
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
          // No pdfUrl from Google API
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

  const toggleFavorite = (book: Book) => {
    const exists = favorites.some((fav) => fav.id === book.id);
    const updated = exists
      ? favorites.filter((fav) => fav.id !== book.id)
      : [...favorites, book];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeFavorite = (bookId: string) => {
    const updatedFavorites = favorites.filter((book) => book.id !== bookId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (bookId: string) => favorites.some((b) => b.id === bookId);

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
          <p>
            <strong>Authors:</strong> {selectedBook.authors.join(', ')}
          </p>

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

          <div style={{ marginTop: '15px' }}>
            {selectedBook.pdfUrl ? (
              pdfAvailability[selectedBook.id] ? (
                <a href={selectedBook.pdfUrl} download className="download-button">
                  📥 Download PDF
                </a>
              ) : (
                <p>Sorry, the PDF is not available for download right now.</p>
              )
            ) : (
              <p>No download available.</p>
            )}
          </div>

          <button onClick={() => toggleFavorite(selectedBook)} style={{ marginTop: '15px' }}>
            {isFavorite(selectedBook.id) ? '💔 Remove from Favorites' : '❤️ Add to Favorites'}
          </button>

          <p style={{ marginTop: '20px' }}>
            <strong>Description:</strong> {selectedBook.description || 'No description available.'}
          </p>
        </div>
      ) : (
        <>
          {!searchQuery && (
            <>
              {favorites.length > 0 && (
                <div className="content-section">
                  <h2 className="section-title">Your Favorite Books</h2>
                  <div className="books-grid">
                    {favorites.map((book) => (
                      <div key={book.id}>
                        <BookCard book={book} onClick={() => setSelectedBook(book)} />
                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                          <button onClick={() => removeFavorite(book.id)} className="delete-button">
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="content-section">
                <h2 className="section-title">Popular Books</h2>
                <div className="books-grid">
                  {POPULAR_BOOKS.map((book) => (
                    <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                  ))}
                </div>
              </div>
            </>
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
