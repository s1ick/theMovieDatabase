import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Movie } from './types/movie';
import Favorites from './components/Favorites';
import MovieDetails from './components/MovieDetails';
import Home from './pages/Home';
import Recommendations from './components/Recommendations';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { useRecommendations } from './hooks/useRecommendations';
import './App.css';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites' | 'recommendations'>('search');
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
        const favs = snapshot.docs.map(doc => ({
          imdbID: doc.id,
          Title: doc.data().Title,
          Year: doc.data().Year,
          Poster: doc.data().Poster,
          Type: doc.data().Type,
          Genre: doc.data().Genre,
          addedAt: doc.data().addedAt
        } as Movie));
        setFavorites(favs);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addFavorite = async (movie: Movie) => {
    if (!user) return;
  
    const movieData = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type || 'movie',
      Genre: movie.Genre || '', // Если Genre undefined, ставим пустую строку
      addedAt: new Date().toISOString()
    };
  
    try {
      await setDoc(doc(db, 'users', user.uid, 'favorites', movie.imdbID), movieData);
    } catch (error) {
      console.error('Error adding favorite movie:', error);
    }
  };

  const removeFavorite = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'favorites', id));
  };

  const handleSearchResults = (results: Movie[]) => {
    setMovies(results);
    setAllMovies(prev => {
      const newMovies = results.filter(m => !prev.some(p => p.imdbID === m.imdbID));
      return [...prev, ...newMovies];
    });
  };

  const recommendations = useRecommendations(favorites, allMovies);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Movie Finder</h1>
          {user ? <UserProfile /> : <div className="w-24"></div>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!user ? (
          <Auth />
        ) : (
          <>
            <div className="flex border-b mb-6 space-x-4">
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                  activeTab === 'search' 
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                } transition-colors`}
                onClick={() => setActiveTab('search')}
              >
                Search Movies
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                  activeTab === 'favorites' 
                    ? 'border-b-2 border-red-500 text-red-600 bg-red-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                } transition-colors`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites ({favorites.length})
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                  activeTab === 'recommendations' 
                    ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                } transition-colors`}
                onClick={() => setActiveTab('recommendations')}
              >
                Recommendations
              </button>
            </div>

            {activeTab === 'search' ? (
  <Home onSearch={handleSearchResults} onSelectMovie={setSelectedMovie} />
) : activeTab === 'favorites' ? (
  <Favorites 
    favorites={favorites} 
    onSelect={setSelectedMovie}
    onRemove={removeFavorite}
    onExport={() => {}}
  />
) : (
  <Recommendations 
    recommendations={recommendations}
    onAddFavorite={addFavorite}
    onSelectMovie={setSelectedMovie}
  />
)}

            {selectedMovie && (
              <MovieDetails 
                imdbID={selectedMovie}
                onClose={() => setSelectedMovie(null)}
                isFavorite={favorites.some(fav => fav.imdbID === selectedMovie)}
                onToggleFavorite={() => {
                  const movie = [...movies, ...favorites, ...recommendations].find(m => m.imdbID === selectedMovie);
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