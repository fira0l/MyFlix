import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, Grid, List, Loader2, Film, Tv, Star, Play, Bookmark, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { movieAPI, userAPI } from '../services/api';

const genreMap = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western' };
const allGenres = ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation'];
const allYears = ['2024', '2023', '2022', '2021', '2020', '2019', '2018'];

const MovieGridCard = ({ movie, onWatch, onBookmark, isBookmarked, onCardClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="poster-card overflow-hidden cursor-pointer relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCardClick(movie)}
    >
      {/* Poster */}
      <div className="relative h-72">
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
            <Film className="w-12 h-12 text-gray-600" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', opacity: hovered ? 1 : 0.7 }} />

        {/* Rating badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-bold">{movie.rating}</span>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium"
          style={{ background: movie.type === 'tv' ? 'rgba(124,58,237,0.8)' : 'rgba(229,9,20,0.8)', backdropFilter: 'blur(8px)' }}>
          {movie.type === 'tv' ? 'TV' : 'Movie'}
        </div>

        {/* Hover actions */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: hovered ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
          <button
            className="skeu-btn px-6 py-2 rounded-xl text-white font-semibold flex items-center gap-2 text-sm"
            onClick={(e) => { e.stopPropagation(); onWatch(movie); }}
          >
            <Play className="w-4 h-4 fill-white" />
            {movie.type === 'tv' ? 'Episodes' : 'Watch Now'}
          </button>
          <button
            className="flat-btn px-4 py-2 rounded-xl text-white text-sm flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); onBookmark(movie); }}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm truncate mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">{movie.releaseDate?.split('-')[0] || 'N/A'}</span>
            {movie.genres.slice(0, 1).map((g, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(229,9,20,0.3)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.3)' }}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MovieListCard = ({ movie, onWatch, onBookmark, isBookmarked, onCardClick }) => (
  <div className="skeu-card flex flex-row overflow-hidden hover:border-red-500/20 transition-all duration-300 cursor-pointer"
    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    onClick={() => onCardClick(movie)}>
    <div className="relative w-24 flex-shrink-0">
      {movie.poster ? (
        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ background: '#1a1a2e' }}>
          <Film className="w-8 h-8 text-gray-600" />
        </div>
      )}
    </div>
    <div className="flex-1 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-base">{movie.title}</h3>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold">{movie.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genres.slice(0, 3).map((g, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.2)' }}>
              {g}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 rounded-full text-gray-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {movie.releaseDate?.split('-')[0] || 'N/A'}
          </span>
        </div>
        <p className="text-gray-400 text-xs line-clamp-2">{movie.overview}</p>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="skeu-btn px-4 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1"
          onClick={(e) => { e.stopPropagation(); onWatch(movie); }}>
          <Play className="w-3 h-3 fill-white" /> Watch
        </button>
        <button className="flat-btn px-4 py-1.5 rounded-lg text-white text-xs flex items-center gap-1"
          onClick={(e) => { e.stopPropagation(); onBookmark(movie); }}>
          <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-white' : ''}`} />
          {isBookmarked ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  </div>
);

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tmdbMovies, setTmdbMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchType, setSearchType] = useState('movie');
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarked, setBookmarked] = useState({});
  const [filters, setFilters] = useState({ minRating: 0, genre: 'all', year: 'all' });

  const moviesPerPage = 12;
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = filteredMovies.slice(startIndex, startIndex + moviesPerPage);

  const searchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) { setTmdbMovies([]); setFilteredMovies([]); return; }
    setIsLoading(true);
    try {
      const allMovies = [];
      for (let page = 1; page <= 10; page++) {
        const endpoint = searchType === 'movie' ? 'search/movie' : 'search/tv';
        const url = `https://api.themoviedb.org/3/${endpoint}?api_key=3fccfc43ac857c99ed340ba2c03bd1e9&query=${encodeURIComponent(searchQuery)}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.results?.length > 0) allMovies.push(...data.results);
        else break;
      }
      setTmdbMovies(allMovies.map(item => ({
        id: item.id, tmdbId: item.id,
        title: item.title || item.name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
        releaseDate: item.release_date || item.first_air_date,
        rating: item.vote_average?.toFixed(1) || 'N/A',
        genres: item.genre_ids?.map(id => genreMap[id]).filter(Boolean) || [],
        overview: item.overview, trailerUrl: '', type: searchType
      })));
    } catch (error) {
      setTmdbMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => searchMovies(query), 500);
    return () => clearTimeout(t);
  }, [query, searchType]);

  useEffect(() => {
    let results = tmdbMovies;
    if (filters.minRating > 0) results = results.filter(m => parseFloat(m.rating) >= filters.minRating);
    if (filters.genre !== 'all') results = results.filter(m => m.genres.includes(filters.genre));
    if (filters.year !== 'all') results = results.filter(m => m.releaseDate?.startsWith(filters.year));
    setFilteredMovies(results);
    setCurrentPage(1);
  }, [tmdbMovies, filters]);

  const handleCardClick = (movie) => {
    if (movie.type === 'tv' && movie.tmdbId) {
      navigate('/tv-detail', { state: { title: movie.title, tmdbId: movie.tmdbId, poster: movie.poster, rating: movie.rating, genres: movie.genres, overview: movie.overview } });
    } else {
      navigate(`/movie/${encodeURIComponent(movie.title)}`, {
        state: { title: movie.title, poster: movie.poster, releaseDate: movie.releaseDate, rating: movie.rating, genres: movie.genres, overview: movie.overview, tmdbId: movie.tmdbId, type: movie.type }
      });
    }
  };

  const handleWatch = (movie) => {
    if (movie.type === 'tv') {
      navigate('/tv-detail', { state: { title: movie.title, tmdbId: movie.tmdbId, poster: movie.poster, rating: movie.rating, genres: movie.genres, overview: movie.overview } });
    } else {
      navigate('/watch', { state: { title: movie.title, tmdbId: movie.tmdbId, type: movie.type, poster: movie.poster, rating: movie.rating, genres: movie.genres, overview: movie.overview } });
    }
  };

  const handleBookmark = async (movie) => {
    const isBookmarked = bookmarked[movie.id];
    try {
      await userAPI.toggleWatchlist(movie, isBookmarked);
      setBookmarked(prev => ({ ...prev, [movie.id]: !isBookmarked }));
    } catch (error) {}
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #0d0d1a 100%)' }}>
      <div className="container mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">
            Discover <span className="gradient-text">Content</span>
          </h1>
          <p className="text-gray-400">Search from thousands of movies and TV shows</p>
        </div>

        {/* Search Bar */}
        <div className="skeu-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Input */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                className="skeu-input w-full pl-12 pr-4 py-3 text-white placeholder-gray-500 text-sm"
                placeholder={`Search ${searchType === 'movie' ? 'movies' : 'TV shows'}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  onClick={() => setQuery('')}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Type toggle */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  className="px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all"
                  style={{ background: searchType === 'movie' ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'transparent', color: 'white' }}
                  onClick={() => setSearchType('movie')}
                >
                  <Film className="w-4 h-4" /> Movies
                </button>
                <button
                  className="px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all"
                  style={{ background: searchType === 'tv' ? 'linear-gradient(145deg, #7c3aed, #6d28d9)' : 'transparent', color: 'white' }}
                  onClick={() => setSearchType('tv')}
                >
                  <Tv className="w-4 h-4" /> TV Shows
                </button>
              </div>

              {/* Filter toggle */}
              <button
                className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
                style={{
                  background: showFilters ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)', color: 'white'
                }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" /> Filters
              </button>

              {/* View mode */}
              <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <button className="p-2 transition-all"
                  style={{ background: viewMode === 'grid' ? 'rgba(229,9,20,0.3)' : 'transparent', color: 'white' }}
                  onClick={() => setViewMode('grid')}>
                  <Grid className="w-4 h-4" />
                </button>
                <button className="p-2 transition-all"
                  style={{ background: viewMode === 'list' ? 'rgba(229,9,20,0.3)' : 'transparent', color: 'white' }}
                  onClick={() => setViewMode('list')}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="skeu-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rating */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-3 block">
                  Min Rating: <span className="text-red-400">{filters.minRating}</span>
                </label>
                <input type="range" min="0" max="10" step="0.5"
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full accent-red-500"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {['all', ...allGenres].map(genre => (
                    <button key={genre}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: filters.genre === genre ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${filters.genre === genre ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                        color: 'white'
                      }}
                      onClick={() => setFilters({ ...filters, genre })}>
                      {genre === 'all' ? 'All' : genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Year</label>
                <div className="flex flex-wrap gap-2">
                  {['all', ...allYears].map(year => (
                    <button key={year}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: filters.year === year ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${filters.year === year ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                        color: 'white'
                      }}
                      onClick={() => setFilters({ ...filters, year })}>
                      {year === 'all' ? 'All' : year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        {filteredMovies.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{filteredMovies.length}</span> {searchType === 'movie' ? 'movies' : 'TV shows'} found
              {totalPages > 1 && <span className="text-gray-500"> · Page {currentPage} of {totalPages}</span>}
            </p>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)', boxShadow: '0 0 20px rgba(229,9,20,0.4)' }}>
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
            <p className="text-gray-400 text-sm">Searching...</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="skeu-card p-16 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
              <SearchIcon className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              {query ? `No results for "${query}"` : 'Start Searching'}
            </h3>
            <p className="text-gray-400">
              {query ? 'Try different keywords or adjust your filters' : `Search for your favorite ${searchType === 'movie' ? 'movies' : 'TV shows'}`}
            </p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-4'
            }>
              {currentMovies.map(movie => viewMode === 'grid' ? (
                <MovieGridCard key={movie.id} movie={movie}
                  onWatch={handleWatch}
                  onBookmark={handleBookmark}
                  onCardClick={handleCardClick}
                  isBookmarked={!!bookmarked[movie.id]}
                />
              ) : (
                <MovieListCard key={movie.id} movie={movie}
                  onWatch={handleWatch}
                  onBookmark={handleBookmark}
                  onCardClick={handleCardClick}
                  isBookmarked={!!bookmarked[movie.id]}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
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
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
