import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddMovie = () => {
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)' },
    tap: { scale: 0.95 },
  };

  const handleAdd = () => {
    if (!title.trim() || !poster.trim()) {
      setError('Please provide both a movie title and a valid poster URL.');
      return;
    }

    // Basic URL validation for poster
    const urlPattern = /^https?:\/\/.*\.(?:jpg|jpeg|png|gif|webp)$/i;
    if (!urlPattern.test(poster)) {
      setError('Please enter a valid image URL (jpg, png, gif, or webp).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newMovie = { id: crypto.randomUUID(), title: title.trim(), poster: poster.trim() };
      const existing = JSON.parse(localStorage.getItem('addedMovies') || '[]');
      const updated = [...existing, newMovie];
      localStorage.setItem('addedMovies', JSON.stringify(updated));
      setTimeout(() => navigate('/dashboard'), 300); // Slight delay for animation
    } catch (err) {
      console.error('Error saving movie:', err);
      setError('Failed to save movie. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1518676590629-3dcbd9c6305c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-red-900/30 to-black/80"></div>

      {/* Form container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-md w-full bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/30"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-8 text-center tracking-tight"
        >
          🎬 Add a Movie
        </motion.h1>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 bg-red-900/70 text-red-200 rounded-lg text-sm text-center border border-red-700/50 shadow-inner"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-100 mb-2"
            >
              Movie Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter movie title"
              className="w-full p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              aria-invalid={error.includes('title') ? 'true' : 'false'}
              aria-describedby={error.includes('title') ? 'title-error' : undefined}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="poster"
              className="block text-sm font-medium text-gray-100 mb-2"
            >
              Poster URL
            </label>
            <input
              id="poster"
              type="text"
              placeholder="Enter poster image URL"
              className="w-full p-3 rounded-lg bg-gray-900/70 text-white border border-gray-600/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
              value={poster}
              onChange={(e) => {
                setPoster(e.target.value);
                setError('');
              }}
              aria-invalid={error.includes('poster') ? 'true' : 'false'}
              aria-describedby={error.includes('poster') ? 'poster-error' : undefined}
            />
          </motion.div>

          <motion.button
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/40"
            onClick={handleAdd}
            disabled={!title.trim() || !poster.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Adding...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Add Movie
                <svg
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddMovie;