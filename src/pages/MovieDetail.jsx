import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaEye, FaRegEye, FaShare, FaArrowLeft, FaCheck } from 'react-icons/fa';

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [watched, setWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const movie = location.state;

  useEffect(() => {
    if (movie) {
      const storedLikes = JSON.parse(localStorage.getItem('likedMovies') || '[]');
      const storedWatched = JSON.parse(localStorage.getItem('watchedMovies') || '[]');
      
      setLiked(storedLikes.some(m => m.title === movie.title));
      setWatched(storedWatched.some(m => m.title === movie.title));
      setIsLoading(false);
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Movie details not found</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  const {
    title,
    poster,
    releaseDate,
    rating,
    genres = [],
    overview,
    trailerUrl
  } = movie;

  const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

  // More realistic cast data with roles
  const cast = [
    { name: 'Actor One', role: 'Main Character' },
    { name: 'Actor Two', role: 'Supporting Role' },
    { name: 'Actor Three', role: 'Villain' },
    { name: 'Actor Four', role: 'Sidekick' },
  ];

  const handleLike = () => {
    const existing = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const updated = liked
      ? existing.filter(m => m.title !== title)
      : [...existing, { 
          title, 
          poster: poster || '',
          rating,
          releaseYear
        }];
    localStorage.setItem('likedMovies', JSON.stringify(updated));
    setLiked(!liked);
  };

  const handleWatched = () => {
    const existing = JSON.parse(localStorage.getItem('watchedMovies') || '[]');
    const updated = watched
      ? existing.filter(m => m.title !== title)
      : [...existing, { 
          title, 
          poster: poster || '',
          rating,
          releaseYear,
          watchedDate: new Date().toISOString()
        }];
    localStorage.setItem('watchedMovies', JSON.stringify(updated));
    setWatched(!watched);
  };

  const handleShare = () => {
    setShared(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setShared(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="flex items-center mb-8 text-gray-300 hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Movies
        </motion.button>

        {/* Movie Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Poster */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/3"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              {poster ? (
                <img
                  src={poster}
                  alt={title}
                  className="w-full h-auto object-cover transition-transform hover:scale-105 duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-96 bg-gray-700 flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-bold">{rating ?? 'N/A'}</span>
                  <span className="mx-2">•</span>
                  <span>{releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatched}
                className={`flex items-center px-4 py-2 rounded-full ${watched ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
              >
                {watched ? <FaEye className="mr-2" /> : <FaRegEye className="mr-2" />}
                {watched ? 'Watched' : 'Mark Watched'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center px-4 py-2 rounded-full ${liked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
              >
                {liked ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                {liked ? 'Liked' : 'Like'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
              >
                <FaShare className="mr-2" />
                Share
              </motion.button>

              {shared && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-green-400 ml-2"
                >
                  <FaCheck className="mr-1" />
                  <span>Copied!</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:w-2/3"
          >
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {overview || 'No description available.'}
              </p>
            </div>

            {/* Trailer */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Trailer</h2>
              {trailerUrl ? (
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={trailerUrl}
                    title={`${title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 md:h-96"
                  />
                </div>
              ) : (
                <div className="bg-gray-700 h-48 flex items-center justify-center rounded-xl text-gray-400 italic">
                  Trailer not available
                </div>
              )}
            </div>

            {/* Cast */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cast.map((person, index) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg shadow"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold mb-2 mx-auto">
                      {person.name.charAt(0)}
                    </div>
                    <h3 className="font-medium text-center">{person.name}</h3>
                    <p className="text-gray-400 text-sm text-center">{person.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>

              {/* Comment Input */}
              <div className="mb-6">
                <textarea
                  className="w-full p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Leave a comment..."
                  rows={3}
                  disabled
                />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-gray-400 text-sm italic">Commenting coming soon...</p>
                  <button
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                    disabled
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Sample Comments */}
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="bg-gray-800 p-4 rounded-xl shadow"
                >
                  <div className="flex items-start mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      U
                    </div>
                    <div>
                      <h4 className="font-medium">user123</h4>
                      <div className="flex items-center text-yellow-400 text-sm">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaRegStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">Absolutely loved this movie. Timeless classic! 🙌</p>
                  <p className="text-gray-500 text-xs mt-2">2 days ago</p>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 5 }}
                  className="bg-gray-800 p-4 rounded-xl shadow"
                >
                  <div className="flex items-start mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      C
                    </div>
                    <div>
                      <h4 className="font-medium">cinephile</h4>
                      <div className="flex items-center text-yellow-400 text-sm">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300">That ending still gives me chills. Masterpiece! 💯</p>
                  <p className="text-gray-500 text-xs mt-2">1 week ago</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetail;