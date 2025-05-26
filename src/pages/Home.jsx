import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, boxShadow: '0 10px 30px rgba(239, 68, 68, 0.5)' },
    tap: { scale: 0.95 },
  };

  const movieData = [
    {
      title: 'The Godfather',
      poster: 'https://images.unsplash.com/photo-1580137189273-9e6975b803e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      title: 'Inception',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      title: 'Pulp Fiction',
      poster: 'https://images.unsplash.com/photo-1543536448-1e7c2f4e4d69?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      title: 'Interstellar',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
    {
      title: 'Joker',
      poster: 'https://images.unsplash.com/photo-1531256379511-6b829bb3d8fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative bg-[url('https://images.unsplash.com/photo-1518676590629-3dcbd9c6305c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-red-900/40 to-black/80 backdrop-blur-sm"></div>

      {/* Floating movie cards with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {movieData.map((movie, i) => (
          <motion.div
            key={movie.title}
            className="absolute bg-gray-900/60 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden"
            style={{
              width: '200px',
              height: '300px',
              left: `${15 + (i * 20)}%`,
              top: `${15 + (i * 15)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [i % 2 ? -6 : 6, i % 2 ? -9 : 9, i % 2 ? -6 : 6],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              src={movie.poster}
              alt={`Poster for ${movie.title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="font-bold text-sm text-white">{movie.title}</h3>
              <div className="flex mt-2">
                {[...Array(5)].map((_, star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex justify-between items-center p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600"
          >
            MyFlix
          </motion.h1>
          <motion.nav
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex space-x-8 text-lg"
          >
            <Link
              to="/login"
              className="relative group hover:text-red-400 transition-all duration-300 font-semibold"
            >
              Login
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-full font-semibold shadow-lg hover:shadow-red-500/40 transition-all duration-300"
              >
                Sign Up
              </Link>
            </motion.div>
          </motion.nav>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center max-w-6xl mx-auto space-y-10 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            <motion.h2
              variants={itemVariants}
              className="text-6xl sm:text-7xl md:text-8xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-500 to-red-600"
            >
              Discover Epic Stories
              <br />
              <span className="text-5xl sm:text-6xl md:text-7xl">Anytime, Anywhere</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl max-w-3xl text-gray-200 leading-relaxed"
            >
              Dive into a world of blockbuster movies and gripping TV shows. Build your watchlist, share with friends, and enjoy seamless streaming.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-10 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Start Your Free Trial
                  <svg
                    className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2"
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
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </main>

        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="p-6 text-center text-gray-300 text-sm"
        >
          <div className="flex justify-center space-x-6 mb-4">
            {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'].map((genre) => (
              <motion.span
                key={genre}
                whileHover={{ scale: 1.1, color: '#f87171' }}
                className="px-4 py-1 bg-gray-900/50 backdrop-blur-sm rounded-full text-xs font-medium text-gray-200 cursor-pointer"
              >
                {genre}
              </motion.span>
            ))}
          </div>
          <p>© {new Date().getFullYear()} MyFlix. All rights reserved.</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Landing;