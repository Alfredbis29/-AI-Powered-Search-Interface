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
    const totalStars = hasHalfStar ? fullStars + 1 : fullStars;
    const emptyStars = 5 - totalStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star text-yellow-300">★</span>); // use different shade for visual half
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star text-gray-300">★</span>);
    }

    return stars;
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        <img
          src={book.imageLinks?.thumbnail || '/default-cover.jpg'}
          alt={book.title}
          className="book-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-cover.jpg';
          }}
        />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title || 'Unknown Title'}</h3>
        <p className="book-author">by {book.authors?.join(', ') || 'Unknown Author'}</p>

        {book.averageRating !== undefined && (
          <div className="book-rating">
            <div className="stars">{renderStars(book.averageRating)}</div>
            <span className="rating-text">
              ({book.ratingsCount?.toLocaleString() || '0'})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
