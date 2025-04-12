import { useState, useEffect, useMemo } from 'react';
import { Movie } from '../types/movie';

export const useRecommendations = (favorites: Movie[], allMovies: Movie[]) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  const userPreferences = useMemo(() => {
    const genreCount: Record<string, number> = {};
    
    favorites.forEach(movie => {
      if (movie.Genre) {
        movie.Genre.split(', ').forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      }
    });

    return genreCount;
  }, [favorites]);

  useEffect(() => {
    if (favorites.length === 0 || allMovies.length === 0) {
      setRecommendations([]);
      return;
    }

    const currentYear = new Date().getFullYear();

    const scoredMovies = allMovies
      .filter(movie => !favorites.some(fav => fav.imdbID === movie.imdbID))
      .map(movie => {
        let score = 0;

        // + Жанровая оценка
        if (movie.Genre) {
          movie.Genre.split(', ').forEach(genre => {
            score += (userPreferences[genre] || 0);
          });
        }

        // + Небольшой бонус свежим фильмам (например, после 2015 года)
        const year = parseInt(movie.Year);
        if (!isNaN(year) && year >= currentYear - 10) {
          score += 1;
        }

        return { ...movie, score };
      });

    // Сортировка: по баллам и немного рандома
    const sorted = scoredMovies.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Math.random() - 0.5;
    });

    setRecommendations(sorted.slice(0, 10));
  }, [favorites, allMovies, userPreferences]);

  return recommendations;
};
