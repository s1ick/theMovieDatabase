import { useState } from 'react';
import { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

interface HomeProps {
  onSearch: (results: Movie[]) => void;
  onSelectMovie: (id: string) => void;
}

const Home = ({ onSearch, onSelectMovie }: HomeProps) => {
  const [error, setError] = useState<string | null>(null);
  const [localMovies, setLocalMovies] = useState<Movie[]>([]);

  const handleSearch = async (query: string) => {
    try {
      if (!query.trim()) {
        setLocalMovies([]);
        onSearch([]);
        return;
      }

      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        setLocalMovies([]);
        onSearch([]);
        setError(data.Error || 'No movies found');
        return;
      }

      const results = data.Search.map((movie: any) => ({
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type,
        Genre: movie.Genre
      } as Movie));

      setLocalMovies(results);
      onSearch(results);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search movies. Please try again.');
      setLocalMovies([]);
      onSearch([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {localMovies.map((movie: Movie) => (
          <MovieCard 
            key={movie.imdbID} 
            movie={movie} 
            onClick={() => onSelectMovie(movie.imdbID)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;