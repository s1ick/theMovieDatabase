import { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
  }
const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск фильмов..."
      />
      <button type="submit">Найти</button>
    </form>
  );
};

export default SearchBar;