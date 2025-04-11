import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Movie } from './types/movie';
import Favorites from './components/Favorites';
import MovieDetails from './components/MovieDetails';
import MovieSearch from './components/MovieSearch';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites'>('search');
  const [user, loading] = useAuthState(auth);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Загрузка избранного из Firestore
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'favorites'),
      (snapshot) => {
        const favs = snapshot.docs.map(doc => doc.data() as Movie);
        setFavorites(favs);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addFavorite = async (movie: Movie) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid, 'favorites', movie.imdbID), movie);
  };

  const removeFavorite = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'favorites', id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Movie Finder</h1>
          {user ? <UserProfile /> : <div className="w-24"></div>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!user ? (
          <Auth />
        ) : (
          <>
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'search' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('search')}
              >
                Search Movies
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'favorites' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites ({favorites.length})
              </button>
            </div>

            {activeTab === 'search' ? (
              <>
                <MovieSearch onSearch={setMovies} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                  {movies.map(movie => (
                    <div 
                      key={movie.imdbID}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedMovie(movie.imdbID)}
                    >
                      <img 
                        src={movie.Poster !== 'N/A' 
                          ? movie.Poster 
                          : 'https://via.placeholder.com/300x450?text=No+Poster'} 
                        alt={movie.Title}
                          loading="lazy"
  decoding="async"
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-semibold truncate">{movie.Title}</h3>
                        <p className="text-sm text-gray-500">{movie.Year}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            favorites.some(fav => fav.imdbID === movie.imdbID)
                              ? removeFavorite(movie.imdbID)
                              : addFavorite(movie);
                          }}
                          className={`mt-2 text-sm ${
                            favorites.some(fav => fav.imdbID === movie.imdbID)
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-blue-500 hover:text-blue-700'
                          }`}
                        >
                          {favorites.some(fav => fav.imdbID === movie.imdbID)
                            ? 'Remove from Favorites'
                            : 'Add to Favorites'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <Favorites 
                favorites={favorites} 
                onSelect={setSelectedMovie}
                onRemove={removeFavorite}
              />
            )}

            {selectedMovie && (
              <MovieDetails 
                imdbID={selectedMovie}
                onClose={() => setSelectedMovie(null)}
                isFavorite={favorites.some(fav => fav.imdbID === selectedMovie)}
                onToggleFavorite={() => {
                  const movie = [...movies, ...favorites].find(m => m.imdbID === selectedMovie);
                  if (movie) {
                    favorites.some(fav => fav.imdbID === selectedMovie)
                      ? removeFavorite(selectedMovie)
                      : addFavorite(movie);
                  }
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;