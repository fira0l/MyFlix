import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, Play, Star, Film, Tv, Plus, Eye, X, Search } from 'lucide-react';
import { userAPI, movieAPI } from '../services/api';

const ContentCard = ({ item, onWatch, onRemove, removeLabel = 'Remove' }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="poster-card overflow-hidden cursor-pointer relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-64">
        {item.poster ? (
          <img src={item.poster} alt={item.title}
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
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)', opacity: hovered ? 1 : 0.7 }} />

        {/* Type badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
          style={item.type === 'tv'
            ? { background: 'rgba(124,58,237,0.85)', color: 'white' }
            : { background: 'rgba(229,9,20,0.85)', color: 'white' }
          }>
          {item.type === 'tv' ? 'TV' : 'Movie'}
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-bold">{item.rating}</span>
          </div>
        )}

        {/* Hover actions */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="skeu-btn px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); onWatch(item); }}>
            <Play className="w-3.5 h-3.5 fill-white" /> Watch Now
          </button>
          <button className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            style={{ background: 'rgba(229,9,20,0.7)', border: '1px solid rgba(229,9,20,0.5)' }}
            onClick={(e) => { e.stopPropagation(); onRemove(item); }}>
            <X className="w-3 h-3" /> {removeLabel}
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-sm truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {item.releaseDate && <span className="text-gray-400 text-xs">{item.releaseDate.split('-')[0]}</span>}
            {item.genres?.slice(0, 1).map((g, i) => (
              <span key={i} className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(229,9,20,0.3)', color: '#ff6b6b' }}>{g}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, description, to, linkLabel, navigate }) => (
  <div className="skeu-card p-16 text-center col-span-full">
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
      <Icon className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6">{description}</p>
    <button className="skeu-btn px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
      onClick={() => navigate(to)}>
      {linkLabel}
    </button>
  </div>
);

const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [addedMovies, setAddedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('watchlist');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([userAPI.getWatchlist(), movieAPI.getAll()])
      .then(([wl, added]) => { setWatchlist(wl); setAddedMovies(added); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleWatch = (item) => {
    if (item.type === 'tv') {
      navigate('/tv-detail', { state: { title: item.title, tmdbId: item.tmdbId, poster: item.poster, rating: item.rating, genres: item.genres || [], overview: item.overview } });
    } else {
      navigate('/watch', { state: { title: item.title, tmdbId: item.tmdbId, type: item.type || 'movie', poster: item.poster, rating: item.rating, genres: item.genres || [], overview: item.overview } });
    }
  };

  const handleRemoveWatchlist = async (item) => {
    try {
      await userAPI.toggleWatchlist(item, true);
      setWatchlist(prev => prev.filter(w => w.title !== item.title));
    } catch (error) {}
  };

  const handleDeleteAdded = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await movieAPI.delete(item.id);
      setAddedMovies(prev => prev.filter(m => m.id !== item.id));
    } catch (error) {}
  };

  const filterItems = (items) =>
    searchQuery ? items.filter(i => i.title?.toLowerCase().includes(searchQuery.toLowerCase())) : items;

  const tabs = [
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, count: watchlist.length, color: '#3b82f6' },
    { id: 'added-all', label: 'All Added', icon: Film, count: addedMovies.length, color: '#e50914' },
    { id: 'added-movies', label: 'Movies', icon: Film, count: addedMovies.filter(m => m.type !== 'tv').length, color: '#e50914' },
    { id: 'added-tv', label: 'TV Shows', icon: Tv, count: addedMovies.filter(m => m.type === 'tv').length, color: '#7c3aed' },
  ];

  const getCurrentItems = () => {
    if (activeTab === 'watchlist') return filterItems(watchlist);
    if (activeTab === 'added-all') return filterItems(addedMovies);
    if (activeTab === 'added-movies') return filterItems(addedMovies.filter(m => m.type !== 'tv'));
    if (activeTab === 'added-tv') return filterItems(addedMovies.filter(m => m.type === 'tv'));
    return [];
  };

  const isWatchlistTab = activeTab === 'watchlist';
  const currentItems = getCurrentItems();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin"
            style={{ border: '3px solid rgba(229,9,20,0.2)', borderTop: '3px solid #e50914' }} />
          <p className="text-gray-400 text-sm">Loading...</p>
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
            <h1 className="text-4xl font-black text-white mb-1">
              My <span className="gradient-text">Collection</span>
            </h1>
            <p className="text-gray-400 text-sm">Manage your watchlist and added content</p>
          </div>
          <button className="skeu-btn px-5 py-2.5 rounded-xl text-white text-sm font-bold flex items-center gap-2 self-start"
            onClick={() => navigate('/add-movie')}>
            <Plus className="w-4 h-4" /> Add Content
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <div key={tab.id} className="skeu-card p-4 flex items-center gap-3 cursor-pointer transition-all"
                style={{ border: activeTab === tab.id ? `1px solid ${tab.color}40` : '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => setActiveTab(tab.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tab.color}20`, border: `1px solid ${tab.color}30` }}>
                  <Icon className="w-4 h-4" style={{ color: tab.color }} />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{tab.count}</div>
                  <div className="text-gray-500 text-xs">{tab.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs + Search */}
        <div className="skeu-card p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Tab Buttons */}
            <div className="flex gap-2 p-1 rounded-xl flex-1" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: active ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'transparent',
                      color: active ? 'white' : '#6b7280',
                      boxShadow: active ? '0 4px 12px rgba(229,9,20,0.3)' : 'none'
                    }}
                    onClick={() => setActiveTab(tab.id)}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs"
                      style={{ background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', color: active ? 'white' : '#6b7280' }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                className="skeu-input w-full pl-9 pr-4 py-2 text-sm"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Content Grid */}
          {currentItems.length === 0 ? (
            <div className="grid">
              {activeTab === 'watchlist' && (
                <EmptyState icon={Bookmark} title="Watchlist is empty" description="Save movies and TV shows to watch later" to="/search" linkLabel="Browse Content" navigate={navigate} />
              )}
              {activeTab === 'added-all' && (
                <EmptyState icon={Film} title="No added content" description="Add movies or TV shows to your collection" to="/add-movie" linkLabel="Add Content" navigate={navigate} />
              )}
              {activeTab === 'added-movies' && (
                <EmptyState icon={Film} title="No added movies" description="Add movies to your collection" to="/add-movie" linkLabel="Add Movie" navigate={navigate} />
              )}
              {activeTab === 'added-tv' && (
                <EmptyState icon={Tv} title="No added TV shows" description="Add TV shows to your collection" to="/add-movie" linkLabel="Add TV Show" navigate={navigate} />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {currentItems.map((item, i) => (
                <ContentCard
                  key={item.id || i}
                  item={item}
                  onWatch={handleWatch}
                  onRemove={isWatchlistTab ? handleRemoveWatchlist : handleDeleteAdded}
                  removeLabel={isWatchlistTab ? 'Remove' : 'Delete'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
