import React from 'react';
import { Movie } from '../types/movie';

interface FavoritesProps {
  favorites: Movie[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

const Favorites = ({ favorites, onSelect, onRemove }: FavoritesProps): React.JSX.Element => {
  if (favorites.length === 0) {
    return <div className="text-gray-500 p-4">No favorites yet</div>;
  }

  return (
    <div className="space-y-4">
      {favorites.map(movie => (
        <div 
          key={movie.imdbID}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => onSelect(movie.imdbID)}
          >
            <h3 className="font-medium">{movie.Title}</h3>
            <p className="text-sm text-gray-500">{movie.Year}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(movie.imdbID);
            }}
            className="ml-4 p-2 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove from favorites"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Favorites;