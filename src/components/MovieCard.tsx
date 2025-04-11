import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="movie-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/movie/${movie.imdbID}`} className="block">
        <img 
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.Title}
          className="w-full h-64 object-cover"
        />
        <div className="p-3">
          <h3 className="font-semibold truncate">{movie.Title}</h3>
          <p className="text-sm text-gray-500">{movie.Year}</p>
          <Rating movieId={movie.imdbID} size="sm" />
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;