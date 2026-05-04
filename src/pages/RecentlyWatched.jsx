import React, { useEffect, useState } from 'react';
import { Clock, Play, Film, Tv, Star, Search, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const formatTime = (watchedAt) => {
  const diff = Math.floor((new Date() - new Date(watchedAt)) / (1000 * 60 * 60));
  if (diff < 1) return 'Just now';
  if (diff < 24) return `${diff}h ago`;
  if (diff < 168) return `${Math.floor(diff / 24)}d ago`;
  return new Date(watchedAt).toLocaleDateString();
};

const RecentlyWatched = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    userAPI.getRecentlyWatched()
      .then(data => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleWatch = (item) => {
    navigate('/watch', {
      state: {
        title: item.title, tmdbId: item.tmdbId, type: item.type || 'movie',
        season: item.season, episode: item.episode,
        poster: item.poster, rating: item.rating,
        genres: item.genres, overview: item.overview
      }
    });
  };

  const handleClearAll = () => {
    if (!window.confirm('Clear all watch history?')) return;
    localStorage.setItem('recentlyWatched', '[]');
    setItems([]);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin"
            style={{ border: '3px solid rgba(229,9,20,0.2)', borderTop: '3px solid #e50914' }} />
          <p className="text-gray-400 text-sm">Loading history...</p>
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
                style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.25)' }}>
                <Clock className="w-5 h-5 text-red-500" />
              </div>
              <h1 className="text-4xl font-black text-white">
                Recently <span className="gradient-text">Watched</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm ml-13">Your complete viewing history</p>
            {items.length > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-red-400 text-xs font-medium">{items.length} items in history</span>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all self-start"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}
              onClick={handleClearAll}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="skeu-card p-16 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
              <Clock className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">No viewing history</h3>
            <p className="text-gray-500 text-sm mb-8">Start watching movies and TV shows to see them here</p>
            <button className="skeu-btn px-8 py-3 rounded-xl text-white font-bold"
              onClick={() => navigate('/search')}>
              Browse Content
            </button>
          </div>
        ) : (
          <>
            {/* Filters & Search */}
            <div className="skeu-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
              {/* Filter Tabs */}
              <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { id: 'all', label: 'All', count: items.length },
                  { id: 'movie', label: 'Movies', count: items.filter(i => i.type !== 'tv').length },
                  { id: 'tv', label: 'TV Shows', count: items.filter(i => i.type === 'tv').length },
                ].map(tab => (
                  <button key={tab.id}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: filter === tab.id ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'transparent',
                      color: filter === tab.id ? 'white' : '#6b7280',
                      boxShadow: filter === tab.id ? '0 4px 12px rgba(229,9,20,0.3)' : 'none'
                    }}
                    onClick={() => setFilter(tab.id)}
                  >
                    {tab.label}
                    <span className="px-1.5 py-0.5 rounded-full text-xs"
                      style={{ background: filter === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', color: filter === tab.id ? 'white' : '#6b7280' }}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  className="skeu-input w-full pl-9 pr-8 py-2 text-sm"
                  placeholder="Search history..."
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

              <p className="text-gray-500 text-xs self-center ml-auto">
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* History List */}
            <div className="space-y-3">
              {filteredItems.map((item, i) => (
                <div key={i} className="skeu-card flex flex-row overflow-hidden group transition-all hover:border-red-500/20"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>

                  {/* Poster */}
                  <div className="relative w-20 flex-shrink-0">
                    {item.poster ? (
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)', minHeight: '100px' }}>
                        <Film className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(0,0,0,0.3))' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-white font-bold text-base truncate">{item.title}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0 px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-400 text-xs">{formatTime(item.watchedAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Type badge */}
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={item.type === 'tv'
                            ? { background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }
                            : { background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.2)' }
                          }>
                          {item.type === 'tv' ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                          {item.type === 'tv' ? `TV · S${item.season}E${item.episode}` : 'Movie'}
                        </span>

                        {/* Rating */}
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-yellow-400 text-xs font-bold">{item.rating}</span>
                          </div>
                        )}

                        {/* Genres */}
                        {item.genres?.slice(0, 2).map((g, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {g}
                          </span>
                        ))}
                      </div>

                      {item.overview && (
                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{item.overview}</p>
                      )}
                    </div>

                    {/* Watch Again Button */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-600 text-xs">
                        {new Date(item.watchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <button
                        className="skeu-btn px-4 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-1.5"
                        onClick={() => handleWatch(item)}
                      >
                        <Play className="w-3 h-3 fill-white" />
                        Watch Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentlyWatched;
