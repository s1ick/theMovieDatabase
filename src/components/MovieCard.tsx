import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const MovieCard = ({ movie }: { movie: any }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.imdbID}`}>
        <img src={movie.Poster} alt={movie.Title} />
        <h3>{movie.Title} ({movie.Year})</h3>
      </Link>
    </div>
  );
};
export default MovieCard;