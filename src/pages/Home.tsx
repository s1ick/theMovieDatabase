import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${query}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      const data = await response.json();
      setMovies(data.Search || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>Movie Finder</h1>
      <SearchBar onSearch={handleSearch} />
      
      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
      {error && <div className="error">{error}</div>}

    </div>
  );
};

export default Home;