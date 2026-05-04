import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play, Bookmark, Eye, Film } from 'lucide-react';
import { userAPI } from '../services/api';

const MovieCard = ({
  title,
  poster,
  releaseDate,
  rating,
  genres = [],
  overview,
  trailerUrl,
  tmdbId,
  type = 'movie'
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

  const handleCardClick = () => {
    if (type === 'tv' && tmdbId) {
      navigate('/tv-detail', { state: { title, tmdbId, poster, rating, genres, overview, trailerUrl } });
    } else {
      navigate(`/movie/${encodeURIComponent(title)}`, {
        state: { title, poster, releaseDate, rating, genres, overview, trailerUrl, tmdbId }
      });
    }
  };

  const handleWatch = (e) => {
    e.stopPropagation();
    if (type === 'tv' && tmdbId) {
      navigate('/tv-detail', { state: { title, tmdbId, poster, rating, genres, overview, trailerUrl } });
    } else if (tmdbId) {
      navigate('/watch', { state: { title, tmdbId, type, poster, rating, genres, overview } });
    } else {
      handleCardClick();
    }
  };

  const handleWatchlist = async (e) => {
    e.stopPropagation();
    const item = { title, poster, releaseDate, rating, genres, overview, trailerUrl, tmdbId, type };
    try {
      await userAPI.toggleWatchlist(item, isInWatchlist);
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {}
  };

  return (
    <div
      className="poster-card overflow-hidden cursor-pointer relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative h-72">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
            loading="lazy"
            onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
            <Film className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)', opacity: hovered ? 1 : 0.7 }} />

        {/* Rating badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-bold">{rating ?? 'N/A'}</span>
        </div>

        {/* Type badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
          style={type === 'tv'
            ? { background: 'rgba(124,58,237,0.85)', color: 'white' }
            : { background: 'rgba(229,9,20,0.85)', color: 'white' }
          }>
          {type === 'tv' ? 'TV' : 'Movie'}
        </div>

        {/* Hover Actions */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0 md:opacity-0'}`}
          style={{ background: hovered ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
          <button
            className="skeu-btn px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2"
            onClick={handleWatch}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {type === 'tv' ? 'Episodes' : 'Watch Now'}
          </button>
          <button
            className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            style={{
              background: isInWatchlist ? 'rgba(59,130,246,0.7)' : 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            onClick={handleWatchlist}
          >
            <Bookmark className={`w-3 h-3 ${isInWatchlist ? 'fill-white' : ''}`} />
            {isInWatchlist ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Mobile always-visible actions */}
        <div className="absolute bottom-12 right-2 flex flex-col gap-1 md:hidden">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(229,9,20,0.85)', boxShadow: '0 2px 8px rgba(229,9,20,0.4)' }}
            onClick={handleWatch}
          >
            <Play className="w-3.5 h-3.5 text-white fill-white" />
          </button>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: isInWatchlist ? 'rgba(59,130,246,0.85)' : 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={handleWatchlist}
          >
            <Bookmark className={`w-3.5 h-3.5 text-white ${isInWatchlist ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm truncate mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">{releaseYear}</span>
            {genres.slice(0, 1).map((g, i) => (
              <span key={i} className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(229,9,20,0.3)', color: '#ff6b6b' }}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
