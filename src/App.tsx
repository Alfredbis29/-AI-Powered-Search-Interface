export default function App() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section
        className="h-96 bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{ backgroundImage: "url('/bookshelf.jpg')" }} // Place a book-themed image in /public
      >
        <div className="bg-black/60 p-6 rounded-xl w-full max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Find your next book to read.
          </h1>
          <input
            type="text"
            placeholder="Search For a Book"
            className="w-full px-4 py-3 rounded-lg text-black"
          />
        </div>
      </section>
    </div>
  );
}
