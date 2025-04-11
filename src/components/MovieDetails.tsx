import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '../types/movie';
import Rating from './Rating';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface MovieDetailsProps {
  imdbID: string;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const MovieDetails = ({ imdbID, onClose, isFavorite, onToggleFavorite }: MovieDetailsProps) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        // First get basic movie data from OMDB API
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
        );
        
        const movieData = response.data;
        
        // Try to get ratings from Firestore (works for all users)
        try {
          const movieDoc = await getDoc(doc(db, 'movies', imdbID));
          if (movieDoc.exists()) {
            setMovie({
              ...movieData,
              averageRating: movieDoc.data().averageRating || 0,
              ratingsCount: movieDoc.data().ratingsCount || 0
            });
            return;
          }
        } catch (firestoreError) {
          console.log("Couldn't fetch ratings data, using default values");
        }
        
        // Fallback if no Firestore data exists
        setMovie({
          ...movieData,
          averageRating: 0,
          ratingsCount: 0
        });
        
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovie();
  }, [imdbID, user]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-6"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </motion.div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg p-6 max-w-md w-full"
        >
          <p>Failed to load movie details</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div 
        className="bg-white rounded-lg p-6 max-w-2xl w-full my-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{movie.Title} ({movie.Year})</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
              alt={movie.Title}
              className="w-full max-w-xs rounded-lg shadow-md"
            />
          </motion.div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <motion.button
                onClick={onToggleFavorite}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mr-2 p-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
              <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
            </div>

            <div className="space-y-3">
              <p><span className="font-semibold">Plot:</span> {movie.Plot}</p>
              <p><span className="font-semibold">Director:</span> {movie.Director}</p>
              <p><span className="font-semibold">Actors:</span> {movie.Actors}</p>
              <p><span className="font-semibold">Genre:</span> {movie.Genre}</p>
              <p><span className="font-semibold">Runtime:</span> {movie.Runtime}</p>
              <p><span className="font-semibold">IMDb Rating:</span> {movie.imdbRating}/10</p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Your Rating:</h3>
              <Rating movieId={imdbID} />
            </div>
                      </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MovieDetails;