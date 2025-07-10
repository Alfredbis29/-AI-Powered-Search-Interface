import React, { useState } from 'react';

interface Book {
  id: string;
  title: string;
  authors: string[];
  imageLinks?: {
    thumbnail?: string;
  };
  averageRating?: number;
  ratingsCount?: number;
  previewLink?: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const rating = book.averageRating || 0;

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(book.title)}`;

  const previewUrl =
    book.previewLink && book.previewLink.startsWith('http')
      ? book.previewLink
      : googleSearchUrl;

  // Image fallback state
  const [imgSrc, setImgSrc] = useState(
    book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x193?text=No+Image'
  );

  // On click, check if previewUrl exists, else redirect to Google Search
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const response = await fetch(previewUrl, { method: 'HEAD' });

      if (response.ok) {
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
      } else {
        // fallback to google search
        window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      // fallback to google search on error
      window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a
      href={previewUrl}
      onClick={handleClick}
      className="book-card"
      style={{ textDecoration: 'none', color: 'inherit' }}
      aria-label={`Preview or search for book: ${book.title}`}
    >
      <div className="book-image-container">
        <img
          src={imgSrc}
          alt={`Cover of ${book.title}`}
          className="book-image"
          onError={() =>
            setImgSrc('https://via.placeholder.com/128x193?text=No+Image')
          }
        />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.authors.join(', ')}</p>
        <div className="book-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? 'filled' : 'empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          {book.ratingsCount !== undefined && (
            <span className="rating-text">({book.ratingsCount})</span>
          )}
        </div>
      </div>
    </a>
  );
};

export default BookCard;
