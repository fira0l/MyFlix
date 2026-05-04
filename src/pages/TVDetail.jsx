import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Star, Tv, ChevronRight, Loader2 } from 'lucide-react';
import { movieAPI } from '../services/api';

const TVDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, tmdbId, poster, rating, genres = [], overview } = location.state || {};

  const [tvDetails, setTvDetails] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loadingShow, setLoadingShow] = useState(true);
  const [loadingSeason, setLoadingSeason] = useState(false);

  useEffect(() => {
    if (!tmdbId) return;
    movieAPI.getTVDetails(tmdbId)
      .then(data => setTvDetails(data))
      .catch(() => {})
      .finally(() => setLoadingShow(false));
  }, [tmdbId]);

  useEffect(() => {
    if (!tmdbId) return;
    setLoadingSeason(true);
    setSelectedEpisode(1);
    movieAPI.getTVSeason(tmdbId, selectedSeason)
      .then(data => setSeasonDetails(data))
      .catch(() => {})
      .finally(() => setLoadingSeason(false));
  }, [tmdbId, selectedSeason]);

  if (!title || !tmdbId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="skeu-card p-10 text-center max-w-md">
          <Tv className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-4">TV Show not found</h2>
          <button className="skeu-btn px-6 py-3 rounded-xl text-white font-semibold" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const totalSeasons = tvDetails?.number_of_seasons || 10;
  const episodes = seasonDetails?.episodes || Array.from({ length: 20 }, (_, i) => ({ episode_number: i + 1, name: `Episode ${i + 1}` }));

  const handleWatch = () => {
    navigate('/watch', {
      state: {
        title: `${title}`,
        tmdbId, type: 'tv',
        season: selectedSeason,
        episode: selectedEpisode,
        poster, rating, genres, overview
      }
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>

      {/* Hero Banner */}
      <div className="relative h-72 overflow-hidden">
        {poster && (
          <>
            <img src={poster} alt={title} className="w-full h-full object-cover object-top scale-110"
              style={{ filter: 'blur(8px)', opacity: 0.25 }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,16,0.4) 0%, rgba(8,8,16,0.98) 100%)' }} />
          </>
        )}
        <div className="absolute bottom-6 left-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-28 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left - Poster */}
          <div className="lg:col-span-1">
            <div className="poster-card overflow-hidden mb-5" style={{ borderRadius: '16px' }}>
              {poster ? (
                <img src={poster} alt={title} className="w-full h-auto object-cover" />
              ) : (
                <div className="w-full h-80 flex items-center justify-center"
                  style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
                  <Tv className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="skeu-card p-4 space-y-3">
              {rating && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{rating}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Seasons</span>
                <span className="text-white text-sm font-semibold">
                  {loadingShow ? '...' : totalSeasons}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Type</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
                  TV Show
                </span>
              </div>
            </div>
          </div>

          {/* Right - Details & Episode Selector */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title & Genres */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tv className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">TV Series</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">{title}</h1>
              <div className="flex flex-wrap gap-2">
                {genres.map((g, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            {overview && (
              <div className="skeu-card p-5">
                <p className="text-gray-400 leading-relaxed text-sm">{overview}</p>
              </div>
            )}

            {/* Episode Selector */}
            <div className="skeu-card p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                Select Episode
              </h2>

              {/* Season Selector */}
              <div className="mb-5">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 block">Season</label>
                {loadingShow ? (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading seasons...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                      <button key={s}
                        className="w-12 h-10 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: selectedSeason === s ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${selectedSeason === s ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                          color: 'white',
                          boxShadow: selectedSeason === s ? '0 4px 12px rgba(229,9,20,0.4)' : 'none'
                        }}
                        onClick={() => setSelectedSeason(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Episode Selector */}
              <div className="mb-6">
                <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 block">
                  Episode {loadingSeason && <Loader2 className="w-3 h-3 animate-spin inline ml-1" />}
                </label>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#e50914 transparent' }}>
                  {episodes.map((ep, i) => {
                    const epNum = ep.episode_number || i + 1;
                    const isSelected = selectedEpisode === epNum;
                    return (
                      <button key={epNum}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                        style={{
                          background: isSelected ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                        onClick={() => setSelectedEpisode(epNum)}
                      >
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: isSelected ? 'rgba(229,9,20,0.3)' : 'rgba(255,255,255,0.06)', color: isSelected ? '#ff6b6b' : '#6b7280' }}>
                          {epNum}
                        </span>
                        <span className="text-sm font-medium truncate" style={{ color: isSelected ? 'white' : '#9ca3af' }}>
                          {ep.name || `Episode ${epNum}`}
                        </span>
                        {isSelected && <ChevronRight className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Watch Button */}
              <button className="skeu-btn w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-3"
                onClick={handleWatch}>
                <Play className="w-5 h-5 fill-white" />
                Watch S{selectedSeason} E{selectedEpisode}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVDetail;
