export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type?: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Genre?: string;
  Runtime?: string;
  imdbRating?: string;
  // Добавляем поля для рейтинга
  userRating?: number;
  averageRating?: number;
  ratingsCount?: number;
}