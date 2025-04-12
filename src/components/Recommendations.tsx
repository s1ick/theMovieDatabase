import { Movie } from '../types/movie';
import { motion } from 'framer-motion';

interface RecommendationsProps {
  recommendations: Movie[];
  onAddFavorite: (movie: Movie) => void;
  onSelectMovie: (id: string) => void;
}

const Recommendations = ({ 
  recommendations, 
  onAddFavorite,
  onSelectMovie
}: RecommendationsProps) => {
  if (recommendations.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        Add more movies to favorites to get recommendations
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {recommendations.map(movie => (
        <motion.div
          key={movie.imdbID}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div 
            className="cursor-pointer h-full flex flex-col"
            onClick={() => onSelectMovie(movie.imdbID)}
          >
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.Title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-grow">
              <h3 className="font-medium">{movie.Title}</h3>
              <p className="text-sm text-gray-600">{movie.Year}</p>
              {movie.Genre && (
                <p className="text-xs text-gray-500 mt-1">{movie.Genre.split(', ')[0]}</p>
              )}
            </div>
            <div className="p-3 border-t">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFavorite(movie);
                }}
                className="w-full py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add to Favorites
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Recommendations;