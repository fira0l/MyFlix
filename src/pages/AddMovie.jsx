import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Plus, X, Search, Star, Calendar, Link as LinkIcon, Image, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { movieAPI } from '../services/api';

const genreMap = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western' };
const availableGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

const FormField = ({ label, required, error, children }) => (
  <div>
    <label className="text-gray-300 text-sm font-semibold mb-2 block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center gap-1.5 mt-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
        <p className="text-red-400 text-xs">{error}</p>
      </div>
    )}
  </div>
);

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', poster: '', overview: '', releaseDate: '', rating: '', genres: [], trailer: '', type: 'movie', tmdbId: null });
  const [currentGenre, setCurrentGenre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('movie');

  const searchTMDB = async () => {
    if (!searchTitle.trim()) return;
    setIsSearching(true);
    try {
      const endpoint = searchType === 'movie' ? 'search/movie' : 'search/tv';
      const url = `https://api.themoviedb.org/3/${endpoint}?api_key=3fccfc43ac857c99ed340ba2c03bd1e9&query=${encodeURIComponent(searchTitle)}`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.results || []);
      setError('');
    } catch (err) {
      setError('Failed to search. Please try again.');
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  const selectMovie = async (item) => {
    let trailerUrl = '';
    try {
      trailerUrl = searchType === 'movie'
        ? await movieAPI.getTrailer(item.id) || ''
        : await movieAPI.getTVTrailer(item.id) || '';
    } catch (err) {}
    setFormData({
      title: item.title || item.name,
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
      overview: item.overview,
      releaseDate: item.release_date || item.first_air_date,
      rating: item.vote_average.toFixed(1),
      genres: item.genre_ids.map(id => genreMap[id]).filter(Boolean),
      trailer: trailerUrl,
      type: searchType,
      tmdbId: item.id
    });
    setSearchResults([]);
    setSearchTitle('');
  };

  const addGenre = (genre) => {
    if (genre && !formData.genres.includes(genre)) {
      setFormData(prev => ({ ...prev, genres: [...prev.genres, genre] }));
      setCurrentGenre('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.poster.trim()) { setError('Title and poster URL are required.'); return; }
    if (!/^https?:\/\/.+/i.test(formData.poster)) { setError('Please enter a valid poster URL.'); return; }
    setIsSubmitting(true);
    try {
      await movieAPI.add({ ...formData, title: formData.title.trim(), poster: formData.poster.trim(), rating: parseFloat(formData.rating) || 0 });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError('Failed to save movie. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-4"
            onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.25)' }}>
              <Film className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Add <span className="gradient-text">Movie</span></h1>
              <p className="text-gray-400 text-sm">Add a movie to your personal collection</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left - Poster Preview */}
          <div className="lg:col-span-1">
            <div className="skeu-card p-4 sticky top-24">
              <h3 className="text-white font-semibold text-sm mb-4">Poster Preview</h3>
              <div className="rounded-xl overflow-hidden mb-4"
                style={{ aspectRatio: '2/3', background: 'linear-gradient(145deg, #1a1a2e, #16213e)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {formData.poster ? (
                  <img src={formData.poster} alt="Poster preview" className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Image className="w-10 h-10 text-gray-600" />
                    <p className="text-gray-600 text-xs text-center px-4">Poster will appear here after searching</p>
                  </div>
                )}
              </div>

              {formData.title && (
                <div className="space-y-2">
                  <p className="text-white font-bold text-sm truncate">{formData.title}</p>
                  {formData.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-sm font-bold">{formData.rating}</span>
                    </div>
                  )}
                  {formData.releaseDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-400 text-xs">{formData.releaseDate.split('-')[0]}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {formData.genres.slice(0, 3).map((g, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.2)' }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-2 space-y-5">

            {/* TMDB Search */}
            <div className="skeu-card p-6">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-red-400" />
                Auto-fill from TMDB
              </h3>

              {/* Type Toggle */}
              <div className="flex gap-2 mb-4">
                {['movie', 'tv'].map(type => (
                  <button key={type} type="button"
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: searchType === type ? 'linear-gradient(145deg, #e50914, #b8070f)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${searchType === type ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                      color: 'white',
                      boxShadow: searchType === type ? '0 4px 12px rgba(229,9,20,0.3)' : 'none'
                    }}
                    onClick={() => { setSearchType(type); setSearchResults([]); }}
                  >
                    {type === 'movie' ? '🎬 Movies' : '📺 TV Shows'}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    className="skeu-input w-full pl-11 pr-4 py-3 text-sm"
                    placeholder="Search movie title..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchTMDB()}
                  />
                </div>
                <button
                  type="button"
                  className="skeu-btn px-5 py-3 rounded-xl text-white text-sm font-bold flex items-center gap-2 disabled:opacity-60"
                  onClick={searchTMDB}
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: '#e50914 transparent' }}>
                  {searchResults.map(movie => (
                    <div key={movie.id}
                      className="flex gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,9,20,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onClick={() => selectMovie(movie)}
                    >
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/46x69'}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{movie.title || movie.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-gray-500 text-xs">{(movie.release_date || movie.first_air_date)?.split('-')[0] || 'N/A'}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-yellow-400 text-xs">{movie.vote_average?.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs line-clamp-2 mt-1">{movie.overview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="skeu-card p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}>
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm">Movie added successfully! Redirecting...</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Movie Title" required>
                    <div className="relative">
                      <Film className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      <input className="skeu-input w-full pl-11 pr-4 py-3 text-sm"
                        placeholder="Enter movie title"
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} />
                    </div>
                  </FormField>

                  <FormField label="Rating (0-10)">
                    <div className="relative">
                      <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      <input type="number" min="0" max="10" step="0.1"
                        className="skeu-input w-full pl-11 pr-4 py-3 text-sm"
                        placeholder="8.5"
                        value={formData.rating}
                        onChange={(e) => setFormData(p => ({ ...p, rating: e.target.value }))} />
                    </div>
                  </FormField>
                </div>

                <FormField label="Poster URL" required>
                  <div className="relative">
                    <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input className="skeu-input w-full pl-11 pr-4 py-3 text-sm"
                      placeholder="https://example.com/poster.jpg"
                      value={formData.poster}
                      onChange={(e) => setFormData(p => ({ ...p, poster: e.target.value }))} />
                  </div>
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Release Date">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      <input type="date"
                        className="skeu-input w-full pl-11 pr-4 py-3 text-sm"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData(p => ({ ...p, releaseDate: e.target.value }))} />
                    </div>
                  </FormField>

                  <FormField label="Trailer URL">
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      <input className="skeu-input w-full pl-11 pr-4 py-3 text-sm"
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.trailer}
                        onChange={(e) => setFormData(p => ({ ...p, trailer: e.target.value }))} />
                    </div>
                  </FormField>
                </div>

                {/* Genres */}
                <FormField label="Genres">
                  <div className="flex gap-2 mb-3">
                    <select
                      className="skeu-input flex-1 px-4 py-3 text-sm"
                      value={currentGenre}
                      onChange={(e) => setCurrentGenre(e.target.value)}
                    >
                      <option value="">Select a genre</option>
                      {availableGenres.map(g => (
                        <option key={g} value={g} style={{ background: '#1a1a2e' }}>{g}</option>
                      ))}
                    </select>
                    <button type="button"
                      className="skeu-btn px-4 py-3 rounded-xl text-white font-bold disabled:opacity-40"
                      onClick={() => addGenre(currentGenre)}
                      disabled={!currentGenre}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.genres.map(genre => (
                        <span key={genre} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                          style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.25)' }}>
                          {genre}
                          <button type="button" onClick={() => setFormData(p => ({ ...p, genres: p.genres.filter(g => g !== genre) }))}>
                            <X className="w-3 h-3 hover:text-white transition-colors" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </FormField>

                {/* Overview */}
                <FormField label="Overview">
                  <textarea
                    className="skeu-input w-full px-4 py-3 text-sm resize-none"
                    placeholder="Enter movie description..."
                    rows={4}
                    value={formData.overview}
                    onChange={(e) => setFormData(p => ({ ...p, overview: e.target.value }))}
                  />
                </FormField>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSubmitting || success}
                    className="skeu-btn flex-1 py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Adding Movie...</>
                    ) : success ? (
                      <><CheckCircle className="w-4 h-4" /> Added!</>
                    ) : (
                      <><Plus className="w-4 h-4" /> Add Movie</>
                    )}
                  </button>
                  <button type="button"
                    className="flat-btn px-6 py-3.5 rounded-xl text-gray-300 font-semibold hover:text-white transition-colors"
                    onClick={() => navigate('/dashboard')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;
