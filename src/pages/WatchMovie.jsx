import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Star, Film, Tv, Share2, ChevronRight, Play, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { userAPI, movieAPI } from '../services/api';

const WatchMovie = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, tmdbId, type = 'movie', season: initSeason, episode: initEpisode, poster, rating, genres = [], overview } = location.state || {};

  const [streamError, setStreamError] = useState(false);
  const [currentSource, setCurrentSource] = useState(0);
  const [markedFinished, setMarkedFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  // TV episode state
  const [currentSeason, setCurrentSeason] = useState(Number(initSeason) || 1);
  const [currentEpisode, setCurrentEpisode] = useState(Number(initEpisode) || 1);
  const [tvDetails, setTvDetails] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [showEpisodePanel, setShowEpisodePanel] = useState(false);

  // Fetch TV details on mount
  useEffect(() => {
    if (type !== 'tv' || !tmdbId) return;
    movieAPI.getTVDetails(tmdbId).then(setTvDetails).catch(() => {});
  }, [tmdbId, type]);

  // Fetch season episodes when season changes
  useEffect(() => {
    if (type !== 'tv' || !tmdbId) return;
    setLoadingSeason(true);
    movieAPI.getTVSeason(tmdbId, currentSeason)
      .then(data => setSeasonDetails(data))
      .catch(() => {})
      .finally(() => setLoadingSeason(false));
  }, [tmdbId, type, currentSeason]);

  const streamSources = type === 'movie' ? [
    `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
    `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    `https://vidsrc.to/embed/movie/${tmdbId}`,
  ] : [
    `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${currentSeason}&e=${currentEpisode}`,
    `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${currentSeason}&e=${currentEpisode}`,
    `https://vidsrc.to/embed/tv/${tmdbId}/${currentSeason}/${currentEpisode}`,
  ];

  const streamUrl = streamSources[currentSource];

  useEffect(() => {
    const track = async () => {
      if (!title || !tmdbId) return;
      const item = { title, tmdbId, type, season: currentSeason, episode: currentEpisode, poster: poster || '', rating: rating || 'N/A', genres, overview: overview || '' };
      try {
        await userAPI.addToRecentlyWatched(item);
        await userAPI.addToContinueWatching(item);
      } catch (error) {}
    };
    track();
  }, [title, tmdbId, currentSeason, currentEpisode]);

  const handleEpisodeChange = (season, episode) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
    setCurrentSource(0);
    setStreamError(false);
  };

  const handleNextEpisode = () => {
    const episodes = seasonDetails?.episodes || [];
    if (currentEpisode < episodes.length) {
      handleEpisodeChange(currentSeason, currentEpisode + 1);
    } else if (tvDetails && currentSeason < tvDetails.number_of_seasons) {
      handleEpisodeChange(currentSeason + 1, 1);
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisode > 1) {
      handleEpisodeChange(currentSeason, currentEpisode - 1);
    } else if (currentSeason > 1) {
      handleEpisodeChange(currentSeason - 1, 1);
    }
  };

  const handleMarkFinished = async () => {
    const item = { title, tmdbId, type, season: currentSeason, episode: currentEpisode, poster: poster || '', rating: rating || 'N/A', genres, overview: overview || '' };
    try {
      await userAPI.removeFromContinueWatching(item);
      setMarkedFinished(true);
    } catch (error) {}
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!title || !tmdbId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="skeu-card p-10 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-white text-xl font-bold mb-4">Content not found</h1>
          <button className="skeu-btn px-6 py-3 rounded-xl text-white font-semibold" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  const totalSeasons = tvDetails?.number_of_seasons || 10;
  const episodes = seasonDetails?.episodes || Array.from({ length: 20 }, (_, i) => ({ episode_number: i + 1, name: `Episode ${i + 1}` }));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 px-6 py-3" style={{ background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-3">
            {type === 'tv' ? <Tv className="w-4 h-4 text-purple-400" /> : <Film className="w-4 h-4 text-red-400" />}
            <span className="text-white font-bold text-sm truncate max-w-xs">{title}</span>
            {type === 'tv' && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(124,58,237,0.3)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)' }}>
                S{currentSeason} E{currentEpisode}
              </span>
            )}
            {rating && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">{rating}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={{ background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`, color: copied ? '#4ade80' : 'white' }}
              onClick={handleShare}>
              <Share2 className="w-3 h-3" />
              {copied ? 'Copied!' : 'Share'}
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={{ background: markedFinished ? 'rgba(34,197,94,0.2)' : 'rgba(229,9,20,0.15)', border: `1px solid ${markedFinished ? 'rgba(34,197,94,0.4)' : 'rgba(229,9,20,0.3)'}`, color: markedFinished ? '#4ade80' : '#ff6b6b' }}
              onClick={handleMarkFinished}>
              <CheckCircle className="w-3 h-3" />
              {markedFinished ? 'Finished!' : 'Mark Finished'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Player */}
          <div className="xl:col-span-3 space-y-4">
            <div className="skeu-card">
              <div className="relative w-full" style={{ paddingBottom: '56.25%', background: '#000' }}>
                {streamError && currentSource >= streamSources.length - 1 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                    style={{ background: 'linear-gradient(145deg, #0d0d1a, #1a1a2e)' }}>
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-white font-bold">Content Unavailable</p>
                    <p className="text-gray-400 text-sm">Try a different source</p>
                    <button className="skeu-btn px-6 py-3 rounded-xl text-white font-semibold" onClick={() => navigate(-1)}>Go Back</button>
                  </div>
                ) : (
                  <iframe
                    key={`${currentSource}-${currentSeason}-${currentEpisode}`}
                    src={streamUrl}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; fullscreen *; picture-in-picture; encrypted-media"
                    title={`Watch ${title}`}
                    onError={() => {
                      if (currentSource < streamSources.length - 1) setCurrentSource(prev => prev + 1);
                      else setStreamError(true);
                    }}
                  />
                )}
              </div>

              {/* Source Switcher + TV Nav */}
              <div className="p-4 flex flex-wrap items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-gray-500 text-xs font-medium">SOURCES:</span>
                <div className="flex gap-2">
                  {streamSources.map((_, i) => (
                    <button key={i}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: currentSource === i ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${currentSource === i ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                        color: 'white',
                        boxShadow: currentSource === i ? '0 4px 12px rgba(229,9,20,0.4)' : 'none'
                      }}
                      onClick={() => { setCurrentSource(i); setStreamError(false); }}>
                      Source {i + 1}
                    </button>
                  ))}
                </div>

                {/* TV Episode Navigation */}
                {type === 'tv' && (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}
                      onClick={handlePrevEpisode}
                      disabled={currentSeason === 1 && currentEpisode === 1}
                    >
                      ← Prev
                    </button>
                    <span className="text-gray-400 text-xs font-medium">S{currentSeason}E{currentEpisode}</span>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.3)', color: '#ff6b6b' }}
                      onClick={handleNextEpisode}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Movie/Show Info */}
            <div className="skeu-card p-5">
              <div className="flex gap-4">
                {poster && (
                  <img src={poster} alt={title} className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
                    style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }} />
                )}
                <div className="flex-1">
                  <h2 className="text-white text-xl font-black mb-2">{title}</h2>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold text-sm">{rating}</span>
                      </div>
                    )}
                    {type === 'tv' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
                        Season {currentSeason} · Episode {currentEpisode}
                      </span>
                    )}
                    {genres.slice(0, 3).map((g, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.2)', color: '#ff6b6b' }}>
                        {g}
                      </span>
                    ))}
                  </div>
                  {overview && <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{overview}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4">

            {/* Episode Selector - TV Only */}
            {type === 'tv' && (
              <div className="skeu-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4"
                  style={{ borderBottom: showEpisodePanel ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                  onClick={() => setShowEpisodePanel(!showEpisodePanel)}
                >
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-bold text-sm">Episodes</span>
                    <span className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>
                      S{currentSeason}E{currentEpisode}
                    </span>
                  </div>
                  {showEpisodePanel ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {showEpisodePanel && (
                  <div className="p-4 space-y-4">
                    {/* Season Selector */}
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Season</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                          <button key={s}
                            className="w-9 h-9 rounded-lg text-xs font-bold transition-all"
                            style={{
                              background: currentSeason === s ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                              border: `1px solid ${currentSeason === s ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                              color: 'white',
                              boxShadow: currentSeason === s ? '0 4px 8px rgba(229,9,20,0.4)' : 'none'
                            }}
                            onClick={() => { setCurrentSeason(s); setCurrentEpisode(1); setCurrentSource(0); setStreamError(false); }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Episode List */}
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                        Episodes {loadingSeason && <Loader2 className="w-3 h-3 animate-spin inline ml-1" />}
                      </p>
                      <div className="space-y-1 max-h-64 overflow-y-auto pr-1"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#e50914 transparent' }}>
                        {episodes.map((ep, i) => {
                          const epNum = ep.episode_number || i + 1;
                          const isActive = currentEpisode === epNum;
                          return (
                            <button key={epNum}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                              style={{
                                background: isActive ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${isActive ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.05)'}`,
                              }}
                              onClick={() => handleEpisodeChange(currentSeason, epNum)}
                            >
                              {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                              )}
                              <span className="text-xs font-bold flex-shrink-0"
                                style={{ color: isActive ? '#ff6b6b' : '#6b7280' }}>
                                E{epNum}
                              </span>
                              <span className="text-xs truncate" style={{ color: isActive ? 'white' : '#9ca3af' }}>
                                {ep.name || `Episode ${epNum}`}
                              </span>
                              {isActive && <Play className="w-3 h-3 text-red-400 ml-auto flex-shrink-0 fill-current" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Now Playing */}
            <div className="skeu-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-white font-bold text-sm">Now Playing</h3>
              </div>
              {poster && (
                <img src={poster} alt={title} className="w-full rounded-xl mb-3 object-cover"
                  style={{ height: '140px', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }} />
              )}
              <p className="text-white font-semibold text-xs truncate">{title}</p>
              {type === 'tv' && (
                <p className="text-gray-400 text-xs mt-1">S{currentSeason} · E{currentEpisode}</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="skeu-card p-4">
              <h3 className="text-white font-bold text-sm mb-3">Quick Actions</h3>
              <div className="space-y-1.5">
                {[
                  { label: 'Browse More', to: '/search' },
                  { label: 'My Watchlist', to: '/watchlist' },
                  { label: 'Continue Watching', to: '/continue-watching' },
                  { label: 'Recently Watched', to: '/recently-watched' },
                ].map((action, i) => (
                  <button key={i}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-gray-300 text-xs hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => navigate(action.to)}>
                    {action.label}
                    <ChevronRight className="w-3 h-3 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="flat-card p-4">
              <h3 className="text-gray-400 font-semibold text-xs mb-3 uppercase tracking-wider">Tips</h3>
              <ul className="space-y-2 text-gray-500 text-xs">
                <li className="flex items-start gap-2"><span className="text-red-500">•</span>If video fails, try Source 2 or 3</li>
                <li className="flex items-start gap-2"><span className="text-red-500">•</span>Use fullscreen for best experience</li>
                {type === 'tv' && <li className="flex items-start gap-2"><span className="text-purple-400">•</span>Use Episodes panel to switch episodes</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMovie;
