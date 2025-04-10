import { useState } from 'react';
import { Movie } from '../types/movie';

interface Props {
  onSearch: (movies: Movie[]) => void;
}

const MovieSearch = ({ onSearch }: Props) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchMovies = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      const data = await response.json();
      onSearch(data.Search || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && searchMovies()}
        placeholder="Search for movies..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isLoading}
      />
      <button
        onClick={searchMovies}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </>
        ) : 'Search'}
      </button>
    </div>
  );
};

export default MovieSearch;