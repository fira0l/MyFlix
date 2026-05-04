// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TMDB_API_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';

// Generic API request function
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Silently fail for expected backend connection issues
    throw error;
  }
};

// Movie API functions
export const movieAPI = {
  // Search TMDB Movies
  searchTMDB: async (query) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    return apiRequest(url);
  },

  // Search TMDB TV Shows
  searchTVTMDB: async (query) => {
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    return apiRequest(url);
  },

  // Get TV Season Details
  getTVSeason: async (tvId, seasonNumber) => {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
    return apiRequest(url);
  },

  // Get TV Show Details
  getTVDetails: async (tvId) => {
    const url = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${TMDB_API_KEY}`;
    return apiRequest(url);
  },

  // Get movie trailer from TMDB
  getTrailer: async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`;
    const data = await apiRequest(url);
    const trailer = data.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  },

  // Get TV show trailer from TMDB
  getTVTrailer: async (tvId) => {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${TMDB_API_KEY}`;
    const data = await apiRequest(url);
    const trailer = data.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  },

  // Get movie cast from TMDB
  getMovieCast: async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
    const data = await apiRequest(url);
    return data.cast?.slice(0, 10) || []; // Return top 10 cast members
  },

  // Get movie reviews from TMDB
  getMovieReviews: async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`;
    const data = await apiRequest(url);
    return data.results?.slice(0, 5) || []; // Return top 5 reviews
  },

  // Add movie (flexible for backend)
  add: async (movieData) => {
    try {
      // Try backend first
      return await apiRequest(`${API_BASE_URL}/movies`, {
        method: 'POST',
        body: JSON.stringify(movieData),
      });
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('addedMovies') || '[]');
      const newMovie = { id: crypto.randomUUID(), ...movieData };
      const updated = [...existing, newMovie];
      localStorage.setItem('addedMovies', JSON.stringify(updated));
      return newMovie;
    }
  },

  // Get all movies (flexible for backend)
  getAll: async () => {
    try {
      // Try backend first
      return await apiRequest(`${API_BASE_URL}/movies`);
    } catch (error) {
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('addedMovies') || '[]');
    }
  },

  // Delete movie (flexible for backend)
  delete: async (movieId) => {
    try {
      // Try backend first
      return await apiRequest(`${API_BASE_URL}/movies/${movieId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('addedMovies') || '[]');
      const updated = existing.filter(m => m.id !== movieId);
      localStorage.setItem('addedMovies', JSON.stringify(updated));
      return { success: true };
    }
  },
};

// User preferences API
export const userAPI = {
  getLikedMovies: async () => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/liked`);
    } catch (error) {
      return JSON.parse(localStorage.getItem('likedMovies') || '[]');
    }
  },

  getWatchedMovies: async () => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/watched`);
    } catch (error) {
      return JSON.parse(localStorage.getItem('watchedMovies') || '[]');
    }
  },

  getWatchlist: async () => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/watchlist`);
    } catch (error) {
      return JSON.parse(localStorage.getItem('watchlist') || '[]');
    }
  },

  toggleWatchlist: async (item, isInWatchlist) => {
    try {
      const method = isInWatchlist ? 'DELETE' : 'POST';
      const url = isInWatchlist 
        ? `${API_BASE_URL}/user/watchlist/${encodeURIComponent(item.title)}`
        : `${API_BASE_URL}/user/watchlist`;
      
      return await apiRequest(url, {
        method,
        body: method === 'POST' ? JSON.stringify(item) : undefined,
      });
    } catch (error) {
      const existing = JSON.parse(localStorage.getItem('watchlist') || '[]');
      const updated = isInWatchlist
        ? existing.filter(m => m.title !== item.title)
        : [...existing, item];
      localStorage.setItem('watchlist', JSON.stringify(updated));
      return { success: true };
    }
  },

  toggleLiked: async (movie, isLiked) => {
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const url = isLiked 
        ? `${API_BASE_URL}/user/liked/${encodeURIComponent(movie.title)}`
        : `${API_BASE_URL}/user/liked`;
      
      return await apiRequest(url, {
        method,
        body: method === 'POST' ? JSON.stringify(movie) : undefined,
      });
    } catch (error) {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('likedMovies') || '[]');
      const updated = isLiked
        ? existing.filter(m => m.title !== movie.title)
        : [...existing, movie];
      localStorage.setItem('likedMovies', JSON.stringify(updated));
      return { success: true };
    }
  },

  getRecentlyWatched: async () => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/recently-watched`);
    } catch (error) {
      return JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
    }
  },

  addToRecentlyWatched: async (item) => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/recently-watched`, {
        method: 'POST',
        body: JSON.stringify({ ...item, watchedAt: new Date().toISOString() }),
      });
    } catch (error) {
      const existing = JSON.parse(localStorage.getItem('recentlyWatched') || '[]');
      const filtered = existing.filter(w => w.title !== item.title);
      const updated = [{ ...item, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 50);
      localStorage.setItem('recentlyWatched', JSON.stringify(updated));
      return { success: true };
    }
  },

  getContinueWatching: async () => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/continue-watching`);
    } catch (error) {
      return JSON.parse(localStorage.getItem('continueWatching') || '[]');
    }
  },

  addToContinueWatching: async (item) => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/continue-watching`, {
        method: 'POST',
        body: JSON.stringify({ ...item, startedAt: new Date().toISOString() }),
      });
    } catch (error) {
      const existing = JSON.parse(localStorage.getItem('continueWatching') || '[]');
      const filtered = existing.filter(w => w.title !== item.title);
      const updated = [{ ...item, startedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
      localStorage.setItem('continueWatching', JSON.stringify(updated));
      return { success: true };
    }
  },

  removeFromContinueWatching: async (item) => {
    try {
      return await apiRequest(`${API_BASE_URL}/user/continue-watching/${encodeURIComponent(item.title)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      const existing = JSON.parse(localStorage.getItem('continueWatching') || '[]');
      const updated = existing.filter(w => w.title !== item.title);
      localStorage.setItem('continueWatching', JSON.stringify(updated));
      return { success: true };
    }
  },
};