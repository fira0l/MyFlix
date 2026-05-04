import React, { useEffect, useState } from 'react';
import { PlayCircle, X, Clock, Film, Tv, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const ContinueWatching = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    userAPI.getContinueWatching()
      .then(data => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (startedAt) => {
    const diff = Math.floor((new Date() - new Date(startedAt)) / (1000 * 60 * 60));
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${diff}h ago`;
    if (diff < 168) return `${Math.floor(diff / 24)}d ago`;
    return new Date(startedAt).toLocaleDateString();
  };

  const handleWatch = (item) => {
    navigate('/watch', {
      state: {
        title: item.title, tmdbId: item.tmdbId, type: item.type,
        season: item.season, episode: item.episode,
        poster: item.poster, rating: item.rating,
        genres: item.genres, overview: item.overview
      }
    });
  };

  const handleRemove = async (item) => {
    try {
      await userAPI.removeFromContinueWatching(item);
      setItems(prev => prev.filter(w => w.title !== item.title));
    } catch (error) {}
  };

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
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.25)' }}>
              <PlayCircle className="w-5 h-5 text-red-500" />
            </div>
            <h1 className="text-4xl font-black text-white">
              Continue <span className="gradient-text">Watching</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm ml-13">Pick up where you left off</p>
          {items.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-medium">{items.length} item{items.length !== 1 ? 's' : ''} in progress</span>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="skeu-card p-16 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
              <PlayCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Nothing to continue</h3>
            <p className="text-gray-500 text-sm mb-8">Start watching movies and TV shows to see them here</p>
            <button className="skeu-btn px-8 py-3 rounded-xl text-white font-bold"
              onClick={() => navigate('/search')}>
              Browse Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <div key={i} className="skeu-card overflow-hidden group relative"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Remove button */}
                <button
                  className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.15)' }}
                  onClick={() => handleRemove(item)}
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>

                {/* Poster */}
                <div className="relative h-56 overflow-hidden">
                  {item.poster ? (
                    <img src={item.poster} alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
                      <Film className="w-12 h-12 text-gray-600" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full w-1/3 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #e50914, #ff6b6b)' }} />
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {item.type === 'tv'
                      ? <Tv className="w-3 h-3 text-purple-400" />
                      : <Film className="w-3 h-3 text-red-400" />
                    }
                    <span className="text-white text-xs font-medium">
                      {item.type === 'tv' ? `S${item.season}E${item.episode}` : 'Movie'}
                    </span>
                  </div>

                  {/* Play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)', boxShadow: '0 0 30px rgba(229,9,20,0.6), 0 8px 20px rgba(0,0,0,0.5)' }}
                      onClick={() => handleWatch(item)}
                    >
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </button>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-wrap gap-1">
                      {item.genres?.slice(0, 2).map((g, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.2)' }}>
                          {g}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {formatTime(item.startedAt)}
                    </div>
                  </div>

                  <button
                    className="skeu-btn w-full py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2"
                    onClick={() => handleWatch(item)}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Continue Watching
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinueWatching;
