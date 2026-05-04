import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Film, Tv, Play, Bookmark, Flame, Award, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const TMDB_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';
const genreMap = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western' };

const categories = [
  { id: 'popular-movies', label: 'Popular Movies', icon: Flame, endpoint: 'movie/popular', type: 'movie' },
  { id: 'top-rated', label: 'Top Rated', icon: Award, endpoint: 'movie/top_rated', type: 'movie' },
  { id: 'now-playing', label: 'Now Playing', icon: Film, endpoint: 'movie/now_playing', type: 'movie' },
  { id: 'upcoming', label: 'Upcoming', icon: Clock, endpoint: 'movie/upcoming', type: 'movie' },
  { id: 'popular-tv', label: 'Popular TV', icon: Tv, endpoint: 'tv/popular', type: 'tv' },
  { id: 'top-rated-tv', label: 'Top Rated TV', icon: Star, endpoint: 'tv/top_rated', type: 'tv' },
];

const ContentCard = ({ item, onWatch, onBookmark, isBookmarked }) => {
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
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
            <Film className="w-12 h-12 text-gray-600" />
          </div>
        )}

        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)', opacity: hovered ? 1 : 0.7 }} />

        {/* Rating */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-bold">{item.rating}</span>
        </div>

        {/* Type */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
          style={item.type === 'tv'
            ? { background: 'rgba(124,58,237,0.85)', color: 'white' }
            : { background: 'rgba(229,9,20,0.85)', color: 'white' }
          }>
          {item.type === 'tv' ? 'TV' : 'Movie'}
        </div>

        {/* Hover Actions */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button className="skeu-btn px-5 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); onWatch(item); }}>
            <Play className="w-3.5 h-3.5 fill-white" /> Watch Now
          </button>
          <button className="px-4 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            style={{ background: isBookmarked ? 'rgba(59,130,246,0.7)' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={(e) => { e.stopPropagation(); onBookmark(item); }}>
            <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-white' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-bold text-sm truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-400 text-xs">{item.releaseDate?.split('-')[0] || 'N/A'}</span>
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

const Recommended = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('popular-movies');
  const [content, setContent] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarked, setBookmarked] = useState({});

  const moviesPerPage = 12;
  const totalPages = Math.ceil(content.length / moviesPerPage);
  const currentItems = content.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

  const fetchContent = async (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;
    setLoading(true);
    try {
      const allItems = [];
      for (let page = 1; page <= 10; page++) {
        const res = await fetch(`https://api.themoviedb.org/3/${cat.endpoint}?api_key=${TMDB_KEY}&page=${page}`);
        const data = await res.json();
        if (data.results?.length > 0) allItems.push(...data.results);
        else break;
      }
      const formatted = allItems.map(item => ({
        id: item.id,
        tmdbId: item.id,
        title: item.title || item.name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
        backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : '',
        releaseDate: item.release_date || item.first_air_date,
        rating: item.vote_average?.toFixed(1) || 'N/A',
        genres: item.genre_ids?.map(id => genreMap[id]).filter(Boolean) || [],
        overview: item.overview,
        type: cat.type,
      }));
      setContent(formatted);
      setFeatured(formatted[0] || null);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(activeCategory); }, [activeCategory]);

  const handleWatch = (item) => {
    if (item.type === 'tv') {
      navigate('/tv-detail', { state: { title: item.title, tmdbId: item.tmdbId, poster: item.poster, rating: item.rating, genres: item.genres, overview: item.overview } });
    } else {
      navigate('/watch', { state: { title: item.title, tmdbId: item.tmdbId, type: 'movie', poster: item.poster, rating: item.rating, genres: item.genres, overview: item.overview } });
    }
  };

  const handleBookmark = async (item) => {
    const isBookmarked = bookmarked[item.id];
    try {
      await userAPI.toggleWatchlist(item, isBookmarked);
      setBookmarked(prev => ({ ...prev, [item.id]: !isBookmarked }));
    } catch (error) {}
  };

  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>

      {/* Featured Hero */}
      {featured && !loading && (
        <div className="relative h-96 overflow-hidden">
          <img src={featured.backdrop || featured.poster} alt={featured.title}
            className="w-full h-full object-cover"
            style={{ filter: 'blur(2px)', opacity: 0.35 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,16,0.2) 0%, rgba(8,8,16,0.98) 100%)' }} />

          <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
            <div className="container mx-auto">
              <div className="flex items-end justify-between gap-6">
                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                      style={{ background: 'rgba(229,9,20,0.2)', border: '1px solid rgba(229,9,20,0.4)' }}>
                      <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-red-400 text-xs font-bold">{activeCat?.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-sm font-bold">{featured.rating}</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">{featured.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featured.genres.slice(0, 3).map((g, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.2)' }}>
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2">{featured.overview}</p>
                </div>
                <button className="skeu-btn px-6 py-3 rounded-xl text-white font-bold flex items-center gap-2 flex-shrink-0"
                  onClick={() => handleWatch(featured)}>
                  <Play className="w-4 h-4 fill-white" /> Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => {
              const Icon = cat.icon;
              const active = activeCategory === cat.id;
              return (
                <button key={cat.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap"
                  style={{
                    background: active ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                    color: 'white',
                    boxShadow: active ? '0 4px 12px rgba(229,9,20,0.4), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none'
                  }}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white">
              {activeCat?.label} <span className="gradient-text">Trending</span>
            </h1>
            {!loading && (
              <p className="text-gray-400 text-sm mt-1">
                {content.length} titles · Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)', boxShadow: '0 0 20px rgba(229,9,20,0.4)' }}>
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
            <p className="text-gray-400 text-sm">Loading {activeCat?.label}...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {currentItems.map((item, i) => (
                <ContentCard key={item.id || i} item={item}
                  onWatch={handleWatch}
                  onBookmark={handleBookmark}
                  isBookmarked={!!bookmarked[item.id]}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return pageNum <= totalPages ? (
                    <button key={pageNum}
                      className="w-9 h-9 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: currentPage === pageNum ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${currentPage === pageNum ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                        color: 'white',
                        boxShadow: currentPage === pageNum ? '0 4px 12px rgba(229,9,20,0.4)' : 'none'
                      }}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ) : null;
                })}

                <button
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommended;
