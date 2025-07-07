export const BookCard = ({ book }: { book: any }) => {
  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : 'https://via.placeholder.com/150x220?text=No+Cover';

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden p-3">
      <img src={cover} alt={book.title} className="w-full h-56 object-cover mb-3" />
      <h2 className="text-lg font-semibold">{book.title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{book.author_name?.[0]}</p>
      <a
        href={`https://openlibrary.org${book.key}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-blue-600 hover:underline text-sm"
      >
        View Book
      </a>
    </div>
  );
};
