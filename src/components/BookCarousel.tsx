interface Book {
  title: string;
  author_name?: string[];
  cover_i?: number;
  key: string;
}

export const BookCarousel = ({ books, title }: { books: Book[]; title: string }) => {
  return (
    <section className="px-6 py-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="flex overflow-x-auto gap-6 pb-4">
        {books.map((book) => {
          const cover = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://via.placeholder.com/150x220?text=No+Cover';

          return (
            <div
              key={book.key}
              className="min-w-[180px] bg-white rounded-xl shadow-md p-3 flex-shrink-0"
            >
              <img
                src={cover}
                alt={book.title}
                className="h-48 w-full object-cover rounded-lg mb-2"
              />
              <h3 className="text-md font-semibold leading-tight">{book.title}</h3>
              <p className="text-sm text-orange-600">{book.author_name?.[0]}</p>
              <p className="text-yellow-500 text-sm mt-1">★★★★★</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
