export const Hero = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <section
      className="h-96 bg-cover bg-center flex items-center justify-center text-white text-center"
      style={{ backgroundImage: `url('/bookshelf.jpg')` }}
    >
      <div className="bg-black/60 p-6 rounded-xl w-full max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Find your next book to read.
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget.querySelector('input') as HTMLInputElement).value;
            if (input.trim()) onSearch(input);
          }}
        >
          <input
            type="text"
            placeholder="Search For a Book"
            className="w-full px-4 py-3 rounded-lg text-black"
          />
        </form>
      </div>
    </section>
  );
};
