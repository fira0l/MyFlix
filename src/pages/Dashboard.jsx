import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [addedMovies, setAddedMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const liked = JSON.parse(localStorage.getItem('likedMovies') || '[]');
      const watched = JSON.parse(localStorage.getItem('watchedMovies') || '[]');
      const added = JSON.parse(localStorage.getItem('addedMovies') || '[]');

      setLikedMovies(liked);
      setWatchedMovies(watched);
      setAddedMovies(added);
    } catch (err) {
      console.error('Error parsing localStorage data:', err);
      setError('Failed to load movie data. Please try again.');
    }
  }, []);

  const placeholderImage = 'https://via.placeholder.com/150x225?text=No+Image';

  const renderMovieCard = (movie, index, isLink = true) => {
    const cardContent = (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <img
          src={movie.poster || placeholderImage}
          alt={`Poster for ${movie.title}`}
          className="w-full h-64 object-cover"
          onError={(e) => (e.target.src = placeholderImage)}
        />
        <div className="p-4">
          <p className="text-white text-sm font-medium text-center truncate">{movie.title}</p>
        </div>
      </div>
    );

    return isLink ? (
      <Link
        to={`/movie/${encodeURIComponent(movie.title)}`}
        key={movie.id || index}
        aria-label={`View details for ${movie.title}`}
        className="block"
      >
        {cardContent}
      </Link>
    ) : (
      <div key={movie.id || index}>{cardContent}</div>
    );
  };

  const renderSection = (title, movies, emoji, isLink = true) => (
    <section className="mb-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="mr-2">{emoji}</span> {title}
      </h2>
      {movies.length === 0 ? (
        <p className="text-gray-400 text-lg">No movies in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie, idx) => renderMovieCard(movie, idx, isLink))}
        </div>
      )}
    </section>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-400 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
        🎬 Your Movie Dashboard
      </h1>
      {renderSection('Liked Movies', likedMovies, '❤️', true)}
      {renderSection('Watched Movies', watchedMovies, '✅', true)}
      {renderSection('Your Added Movies', addedMovies, '✨', false)}
    </div>
  );
};

export default Dashboard;