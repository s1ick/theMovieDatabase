import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await axios.get(
        `https://www.omdbapi.com/?i=${id}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      setMovie(response.data);
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-details">
      <h1>{movie.Title} ({movie.Year})</h1>
      <img src={movie.Poster}
        loading="lazy"
  decoding="async"
      alt={movie.Title} />
      <p><strong>Режиссёр:</strong> {movie.Director}</p>
      <p><strong>Актёры:</strong> {movie.Actors}</p>
      <p><strong>Рейтинг:</strong> {movie.imdbRating}</p>
      <p>{movie.Plot}</p>
    </div>
  );
};
export default MovieDetails;