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
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }

    return stars;
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        <img
          src={book.imageLinks?.thumbnail || '/api/placeholder/200/300'}
          alt={book.title}
          className="book-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/200/300';
          }}
        />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.authors.join(', ')}</p>
        {book.averageRating && (
          <div className="book-rating">
            <div className="stars">
              {renderStars(book.averageRating)}
            </div>
            <span className="rating-text">
              ({book.ratingsCount ? book.ratingsCount.toLocaleString() : '0'})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;