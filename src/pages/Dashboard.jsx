import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Plus, Film, Trash2, Play, Star, Bookmark, Clock, PlayCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { movieAPI, userAPI } from '../services/api';

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="skeu-card p-6 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-gray-500 text-xs">{label}</div>
    </div>
  </div>
);

const MovieCard = ({ movie, onView, onDelete, showDelete }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="poster-card overflow-hidden cursor-pointer relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(movie)}
    >
      <div className="relative h-56">
        <img
          src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'}
        />
        <div className="absolute inset-0 transition-all duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)', opacity: hovered ? 1 : 0.6 }} />

        {/* Hover actions */}
        <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="skeu-btn px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1"
            onClick={(e) => { e.stopPropagation(); onView(movie); }}>
            <Eye className="w-3 h-3" /> View
          </button>
          {showDelete && (
            <button className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1 transition-all"
              style={{ background: 'rgba(229,9,20,0.8)', border: '1px solid rgba(229,9,20,0.5)' }}
              onClick={(e) => { e.stopPropagation(); onDelete(movie); }}>
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={movie.type === 'tv'
              ? { background: 'rgba(124,58,237,0.8)', color: 'white' }
              : { background: 'rgba(229,9,20,0.8)', color: 'white' }
            }>
            {movie.type === 'tv' ? 'TV' : 'Movie'}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-xs font-semibold truncate">{movie.title}</p>
          {movie.rating && (
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-xs">{movie.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, description, linkTo, linkLabel }) => (
  <div className="skeu-card p-12 text-center">
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
      <Icon className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6">{description}</p>
    <Link to={linkTo}>
      <button className="skeu-btn px-6 py-2.5 rounded-xl text-white text-sm font-semibold">
        {linkLabel}
      </button>
    </Link>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [addedMovies, setAddedMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('liked');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadData = async () => {
      try {
        const [liked, watched, added, continueData, watchlistData] = await Promise.all([
          userAPI.getLikedMovies(),
          userAPI.getWatchedMovies(),
          movieAPI.getAll(),
          userAPI.getContinueWatching(),
          userAPI.getWatchlist(),
        ]);
        setLikedMovies(liked);
        setWatchedMovies(watched);
        setAddedMovies(added);
        setContinueWatching(continueData);
        setWatchlist(watchlistData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  const handleView = (movie) => {
    if (movie.type === 'tv') {
      navigate('/tv-detail', {
        state: { title: movie.title, tmdbId: movie.tmdbId, poster: movie.poster, rating: movie.rating, genres: movie.genres || [], overview: movie.overview }
      });
    } else {
      navigate(`/movie/${encodeURIComponent(movie.title)}`, {
        state: { title: movie.title, poster: movie.poster, releaseDate: movie.releaseDate, rating: movie.rating, genres: movie.genres || [], overview: movie.overview, tmdbId: movie.tmdbId }
      });
    }
  };

  const handleDelete = async (movie) => {
    if (window.confirm(`Delete "${movie.title}"?`)) {
      try {
        await movieAPI.delete(movie.id);
        setAddedMovies(prev => prev.filter(m => m.id !== movie.id));
      } catch (error) {}
    }
  };

  const tabs = [
    { id: 'liked', label: 'Liked', icon: Heart, count: likedMovies.length },
    { id: 'watched', label: 'Watched', icon: Eye, count: watchedMovies.length },
    { id: 'added-all', label: 'All Added', icon: Film, count: addedMovies.length },
    { id: 'added-movies', label: 'Movies', icon: Film, count: addedMovies.filter(m => m.type !== 'tv').length },
    { id: 'added-tv', label: 'TV Shows', icon: Plus, count: addedMovies.filter(m => m.type === 'tv').length },
  ];

  const tabContent = {
    liked: { movies: likedMovies, empty: { icon: Heart, title: 'No liked movies', description: 'Like movies to see them here', linkTo: '/search', linkLabel: 'Browse Movies' } },
    watched: { movies: watchedMovies, empty: { icon: Eye, title: 'No watched movies', description: 'Mark movies as watched to track history', linkTo: '/search', linkLabel: 'Browse Movies' } },
    'added-all': { movies: addedMovies, empty: { icon: Film, title: 'No added content', description: 'Add movies or TV shows to your collection', linkTo: '/add-movie', linkLabel: 'Add Content' }, showDelete: true },
    'added-movies': { movies: addedMovies.filter(m => m.type !== 'tv'), empty: { icon: Film, title: 'No added movies', description: 'Add movies to your collection', linkTo: '/add-movie', linkLabel: 'Add Movie' }, showDelete: true },
    'added-tv': { movies: addedMovies.filter(m => m.type === 'tv'), empty: { icon: Plus, title: 'No added TV shows', description: 'Add TV shows to your collection', linkTo: '/add-movie', linkLabel: 'Add TV Show' }, showDelete: true },
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>
      <div className="container mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-1">
                My <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-400 text-sm">
                Welcome back, <span className="text-red-400 font-semibold">{user?.email?.split('@')[0]}</span>
              </p>
            </div>
            <Link to="/add-movie">
              <button className="skeu-btn px-5 py-2.5 rounded-xl text-white text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Movie
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Heart} value={likedMovies.length} label="Liked Movies" color="#e50914" />
          <StatCard icon={Eye} value={watchedMovies.length} label="Watched" color="#22c55e" />
          <StatCard icon={Bookmark} value={watchlist.length} label="Watchlist" color="#3b82f6" />
          <StatCard icon={PlayCircle} value={continueWatching.length} label="In Progress" color="#f59e0b" />
        </div>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-xl flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-red-500" />
                Continue Watching
              </h2>
              <Link to="/continue-watching" className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {continueWatching.slice(0, 6).map((item, i) => (
                <div key={i} className="poster-card overflow-hidden cursor-pointer"
                  onClick={() => navigate('/watch', { state: { title: item.title, tmdbId: item.tmdbId, type: item.type, season: item.season, episode: item.episode, poster: item.poster, rating: item.rating, genres: item.genres, overview: item.overview } })}>
                  <div className="relative h-44">
                    <img src={item.poster || 'https://via.placeholder.com/300x450'} alt={item.title}
                      className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-400 text-xs">In Progress</span>
                      </div>
                      <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)', boxShadow: '0 0 20px rgba(229,9,20,0.5)' }}>
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: TrendingUp, label: 'Recommended', to: '/recommended', color: '#e50914' },
            { icon: Bookmark, label: 'My Watchlist', to: '/watchlist', color: '#3b82f6' },
            { icon: Clock, label: 'Recently Watched', to: '/recently-watched', color: '#22c55e' },
            { icon: Film, label: 'Browse Content', to: '/search', color: '#f59e0b' },
          ].map(({ icon: Icon, label, to, color }, i) => (
            <Link key={i} to={to}>
              <div className="flat-card p-4 flex items-center gap-3 hover:border-white/15 transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
                <ChevronRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-gray-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Movie Collections Tabs */}
        <div className="skeu-card p-6">
          <h2 className="text-white font-bold text-xl mb-6">My Collections</h2>

          {/* Tab Headers */}
          <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: active ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'transparent',
                    color: active ? 'white' : '#6b7280',
                    boxShadow: active ? '0 4px 12px rgba(229,9,20,0.3), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none'
                  }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className="px-1.5 py-0.5 rounded-full text-xs"
                    style={{ background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', color: active ? 'white' : '#6b7280' }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {(() => {
            const { movies, empty, showDelete } = tabContent[activeTab];
            if (movies.length === 0) return <EmptyState {...empty} />;
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie, i) => (
                  <MovieCard key={movie.id || i} movie={movie} onView={handleView}
                    onDelete={handleDelete} showDelete={!!showDelete} />
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
