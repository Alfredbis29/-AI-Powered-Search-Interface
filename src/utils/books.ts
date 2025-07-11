export const fetchBooks = async (query: string) => {
  const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=12`);
  const data = await res.json();
  return data.docs;
};
