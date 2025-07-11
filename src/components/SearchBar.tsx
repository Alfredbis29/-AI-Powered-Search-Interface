import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    onSearch(query);
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search For a Book"
        className="search-input"
      />
    </form>
  );
};

export default SearchBar;
