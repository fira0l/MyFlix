import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';

const dummyMovies = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    releaseDate: '1994-09-23',
    rating: 9.3,
    genres: ['Drama', 'Crime'],
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    trailerUrl: 'https://www.youtube.com/embed/6hB3S9bIaco',
  },
  {
    id: 2,
    title: 'The Dark Knight',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    releaseDate: '2008-07-18',
    rating: 9.0,
    genres: ['Action', 'Crime', 'Drama'],
    overview: 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.',
    trailerUrl: 'https://www.youtube.com/embed/EXeTwQWrcwY',
  },
  {
    id: 3,
    title: 'Inception',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    releaseDate: '2010-07-16',
    rating: 8.8,
    genres: ['Action', 'Science Fiction', 'Adventure'],
    overview: 'A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    releaseDate: '1994-10-14',
    rating: 8.9,
    genres: ['Crime', 'Drama'],
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    trailerUrl: 'https://www.youtube.com/embed/s7EdQ4FqbhY',
  },
  {
    id: 5,
    title: 'The Godfather',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    releaseDate: '1972-03-24',
    rating: 9.2,
    genres: ['Crime', 'Drama'],
    overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    trailerUrl: 'https://www.youtube.com/embed/sY1S34973zA',
  },
];

const Search = () => {
  const [query, setQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(dummyMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    genre: 'all',
    year: 'all'
  });

  // Get all unique genres for filter
  const allGenres = [...new Set(dummyMovies.flatMap(movie => movie.genres))];
  const allYears = [...new Set(dummyMovies.map(movie => movie.releaseDate.split('-')[0]))];

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let results = dummyMovies;
      
      // Apply search query filter
      if (query) {
        results = results.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.genres.some(genre => 
              genre.toLowerCase().includes(query.toLowerCase()))
          );
      }

      // Apply rating filter
      if (filters.minRating > 0) {
        results = results.filter(movie => movie.rating >= filters.minRating);
      }
      
      // Apply genre filter
      if (filters.genre !== 'all') {
        results = results.filter(movie => movie.genres.includes(filters.genre));
      }
      
      // Apply year filter
      if (filters.year !== 'all') {
        results = results.filter(movie => 
          movie.releaseDate.startsWith(filters.year)
        );
      }
      
      setFilteredMovies(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, filters]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Search Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300"
        >
          Discover Great Movies
        </motion.h1>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies by title, genre..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 p-4 rounded-lg mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Rating</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-10 text-center">{filters.minRating}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => setFilters({...filters, genre: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                >
                  <option value="all">All Genres</option>
                  {allGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Release Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({...filters, year: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                >
                  <option value="all">All Years</option>
                  {allYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
            />
          </div>
        ) : filteredMovies.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h2 className="text-2xl font-semibold mb-2">No movies found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  poster={movie.poster}
                  releaseDate={movie.releaseDate}
                  rating={movie.rating}
                  genres={movie.genres}
                  overview={movie.overview}
                  trailerUrl={movie.trailerUrl}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Search;