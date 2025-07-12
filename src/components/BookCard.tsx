import React from 'react';

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

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-image-container">
        <img
          className="book-image"
          src={book.imageLinks?.thumbnail}
          alt={book.title}
        />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.authors.join(', ')}</p>
        <div className="book-rating">
          <span className="rating-text">
            {book.averageRating ? `${book.averageRating} ★` : 'No rating'}
          </span>
          <span className="rating-text">({book.ratingsCount || 0})</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
