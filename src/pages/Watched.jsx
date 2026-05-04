import React, { useEffect, useState } from 'react';
import { Eye, Play, Star, Film, Search, X, CheckCircle, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const Watched = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();

  useEffect(() => {
    userAPI.getWatchedMovies()
      .then(data => setMovies(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUnmark = (movie) => {
    const existing = JSON.parse(localStorage.getItem('watchedMovies') || '[]');
    const updated = existing.filter(m => m.title !== movie.title);
    localStorage.setItem('watchedMovies', JSON.stringify(updated));
    setMovies(prev => prev.filter(m => m.title !== movie.title));
  };

  const handleWatch = (movie) => {
    navigate('/watch', {
      state: { title: movie.title, tmdbId: movie.tmdbId, type: movie.type || 'movie', poster: movie.poster, rating: movie.rating, genres: movie.genres || [], overview: movie.overview }
    });
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all watched movies?')) return;
    localStorage.setItem('watchedMovies', '[]');
    setMovies([]);
  };

  const getSorted = (items) => {
    const filtered = searchQuery
      ? items.filter(m => m.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      : items;
    if (sortBy === 'title') return [...filtered].sort((a, b) => a.title?.localeCompare(b.title));
    if (sortBy === 'rating') return [...filtered].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    return filtered;
  };

  const displayMovies = getSorted(movies);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin"
            style={{ border: '3px solid rgba(229,9,20,0.2)', borderTop: '3px solid #e50914' }} />
          <p className="text-gray-400 text-sm">Loading watched movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>
      <div className="container mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <Eye className="w-5 h-5 text-green-400" />
              </div>
              <h1 className="text-4xl font-black text-white">
                Watched <span className="gradient-text">Movies</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm">Movies you've marked as watched</p>
            {movies.length > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400 text-xs font-medium">{movies.length} movie{movies.length !== 1 ? 's' : ''} watched</span>
              </div>
            )}
          </div>

          {movies.length > 0 && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all self-start"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}
              onClick={handleClearAll}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {movies.length === 0 ? (
          <div className="skeu-card p-16 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <Eye className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No watched movies yet</h3>
            <p className="text-gray-500 text-sm mb-8">Mark movies as watched from the movie detail page</p>
            <button className="skeu-btn px-8 py-3 rounded-xl text-white font-bold"
              onClick={() => navigate('/search')}>
              Browse Movies
            </button>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="skeu-card p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  className="skeu-input w-full pl-9 pr-8 py-2 text-sm"
                  placeholder="Search watched movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    onClick={() => setSearchQuery('')}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">Sort by:</span>
                {[
                  { id: 'recent', label: 'Recent' },
                  { id: 'title', label: 'Title' },
                  { id: 'rating', label: 'Rating' },
                ].map(sort => (
                  <button key={sort.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: sortBy === sort.id ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${sortBy === sort.id ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                      color: 'white',
                      boxShadow: sortBy === sort.id ? '0 4px 8px rgba(229,9,20,0.3)' : 'none'
                    }}
                    onClick={() => setSortBy(sort.id)}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>

              <p className="text-gray-500 text-xs ml-auto">
                {displayMovies.length} result{displayMovies.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayMovies.map((movie, i) => (
                <MovieCard
                  key={movie.id || i}
                  movie={movie}
                  onWatch={handleWatch}
                  onUnmark={handleUnmark}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MovieCard = ({ movie, onWatch, onUnmark }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="poster-card overflow-hidden cursor-pointer relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-64">
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
            onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
            <Film className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)', opacity: hovered ? 1 : 0.7 }} />

        {/* Watched badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(34,197,94,0.85)', color: 'white' }}>
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs font-bold">Watched</span>
        </div>

        {/* Rating */}
        {movie.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-bold">{movie.rating}</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="skeu-btn px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); onWatch(movie); }}>
            <Play className="w-3.5 h-3.5 fill-white" /> Watch Again
          </button>
          <button className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            style={{ background: 'rgba(229,9,20,0.7)', border: '1px solid rgba(229,9,20,0.5)' }}
            onClick={(e) => { e.stopPropagation(); onUnmark(movie); }}>
            <X className="w-3 h-3" /> Unmark
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-sm truncate">{movie.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {movie.releaseYear && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-xs">{movie.releaseYear}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watched;
