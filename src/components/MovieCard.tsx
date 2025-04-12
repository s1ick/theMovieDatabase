import { Movie } from '../types/movie';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
        alt={movie.Title}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{movie.Title}</h3>
        <p className="text-gray-600 text-sm">{movie.Year}</p>
        {movie.Genre && (
          <p className="text-gray-500 text-xs mt-1 truncate">{movie.Genre.split(', ')[0]}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;