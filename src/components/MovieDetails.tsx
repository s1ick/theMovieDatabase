import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '../types/movie';

interface MovieDetailsProps {
  imdbID: string;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MovieDetails = ({ imdbID, onClose, isFavorite, onToggleFavorite }: MovieDetailsProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovie();
  }, [imdbID]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <p>Failed to load movie details</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{movie.Title} ({movie.Year})</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
              alt={movie.Title}
              className="w-full max-w-xs rounded-lg shadow-md"
            />
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <button
                onClick={onToggleFavorite}
                className="mr-2 p-2 text-red-500 hover:text-red-700 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
            </div>

            <div className="space-y-3">
              <p><span className="font-semibold">Plot:</span> {movie.Plot}</p>
              <p><span className="font-semibold">Director:</span> {movie.Director}</p>
              <p><span className="font-semibold">Actors:</span> {movie.Actors}</p>
              <p><span className="font-semibold">Genre:</span> {movie.Genre}</p>
              <p><span className="font-semibold">Runtime:</span> {movie.Runtime}</p>
              <p><span className="font-semibold">Rating:</span> {movie.imdbRating}/10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;