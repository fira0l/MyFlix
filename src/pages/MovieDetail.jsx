import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Eye, Share2, Check, Play, Calendar, Film, User } from 'lucide-react';
import { movieAPI } from '../services/api';

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [watched, setWatched] = useState(false);
  const [shared, setShared] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState('');
  const [reviews, setReviews] = useState([]);

  const movie = location.state;

  useEffect(() => {
    const loadMovieData = async () => {
      if (!movie) return;
      const storedLikes = JSON.parse(localStorage.getItem('likedMovies') || '[]');
      const storedWatched = JSON.parse(localStorage.getItem('watchedMovies') || '[]');
      setLiked(storedLikes.some(m => m.title === movie.title));
      setWatched(storedWatched.some(m => m.title === movie.title));

      if (movie.tmdbId) {
        try {
          const [castData, trailerUrl, reviewsData] = await Promise.all([
            movieAPI.getMovieCast(movie.tmdbId),
            movieAPI.getTrailer(movie.tmdbId),
            movieAPI.getMovieReviews(movie.tmdbId)
          ]);
          setCast(castData);
          setTrailer(trailerUrl || movie.trailerUrl || '');
          setReviews(reviewsData);
        } catch (error) {
          setTrailer(movie.trailerUrl || '');
        }
      } else {
        setTrailer(movie.trailerUrl || '');
      }
      setIsLoading(false);
    };
    loadMovieData();
  }, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="skeu-card p-10 text-center max-w-md">
          <Film className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-4">Movie not found</h2>
          <button className="skeu-btn px-6 py-3 rounded-xl text-white font-semibold" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full animate-spin"
            style={{ border: '3px solid rgba(229,9,20,0.2)', borderTop: '3px solid #e50914' }} />
          <p className="text-gray-400 text-sm">Loading movie details...</p>
        </div>
      </div>
    );
  }

  const { title, poster, releaseDate, rating, genres = [], overview, tmdbId, type = 'movie' } = movie;
  const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

  const handleLike = () => {
    const existing = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const updated = liked
      ? existing.filter(m => m.title !== title)
      : [...existing, { title, poster: poster || '', rating, releaseYear }];
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
          releaseDate,
          genres,
          overview,
          tmdbId,
          type,
          watchedDate: new Date().toISOString()
        }];
    localStorage.setItem('watchedMovies', JSON.stringify(updated));
    setWatched(!watched);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleWatch = () => {
    navigate('/watch', { state: { title, tmdbId, type, poster, rating, genres, overview } });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #080810 0%, #0a0a14 100%)' }}>

      {/* Hero Banner */}
      <div className="relative h-80 overflow-hidden">
        {poster && (
          <>
            <img src={poster} alt={title} className="w-full h-full object-cover object-top scale-110"
              style={{ filter: 'blur(8px)', opacity: 0.3 }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,16,0.3) 0%, rgba(8,8,16,0.95) 100%)' }} />
          </>
        )}
        <div className="absolute inset-0 flex items-end px-6 pb-6">
          <div className="container mx-auto">
            <button
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left - Poster & Actions */}
          <div className="lg:col-span-1">
            {/* Poster */}
            <div className="poster-card overflow-hidden mb-6" style={{ borderRadius: '16px' }}>
              {poster ? (
                <img src={poster} alt={title} className="w-full h-auto object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-80 flex items-center justify-center"
                  style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
                  <Film className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>

            {/* Watch Button */}
            <button className="skeu-btn w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-3 mb-3"
              onClick={handleWatch}>
              <Play className="w-5 h-5 fill-white" />
              Watch Now
            </button>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: liked ? 'rgba(229,9,20,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${liked ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: liked ? '#ff6b6b' : '#9ca3af'
                }}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </button>

              <button
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: watched ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${watched ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: watched ? '#4ade80' : '#9ca3af'
                }}
                onClick={handleWatched}
              >
                <Eye className={`w-4 h-4 ${watched ? 'fill-current' : ''}`} />
                {watched ? 'Watched' : 'Watched'}
              </button>

              <button
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: shared ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${shared ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: shared ? '#60a5fa' : '#9ca3af'
                }}
                onClick={handleShare}
              >
                {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {shared ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Movie Meta */}
            <div className="skeu-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">{rating ?? 'N/A'}</span>
                  <span className="text-gray-500 text-xs">/10</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Year</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-300 text-sm">{releaseYear}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Type</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.2)' }}>
                  {type === 'tv' ? 'TV Show' : 'Movie'}
                </span>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="lg:col-span-3 space-y-6">

            {/* Title & Genres */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">{title}</h1>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(229,9,20,0.15)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.25)' }}>
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="skeu-card p-6">
              <h2 className="text-white font-bold text-lg mb-3">Overview</h2>
              <p className="text-gray-400 leading-relaxed">{overview || 'No description available.'}</p>
            </div>

            {/* Trailer */}
            <div className="skeu-card p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500" />
                Trailer
              </h2>
              {trailer ? (
                <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={trailer.replace('watch?v=', 'embed/')}
                    title={`${title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Play className="w-10 h-10 text-gray-600 mb-3" />
                  <p className="text-gray-500 text-sm">Trailer not available</p>
                </div>
              )}
            </div>

            {/* Cast */}
            <div className="skeu-card p-6">
              <h2 className="text-white font-bold text-lg mb-5">Cast</h2>
              {cast.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {cast.map((person, i) => (
                    <div key={i} className="text-center group">
                      <div className="relative mx-auto mb-2 rounded-full overflow-hidden"
                        style={{ width: '64px', height: '64px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.08)' }}>
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}>
                            <User className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs font-semibold truncate">{person.name}</p>
                      <p className="text-gray-500 text-xs truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Cast information not available</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="skeu-card p-6">
              <h2 className="text-white font-bold text-lg mb-5">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <div key={i} className="p-4 rounded-xl transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                          style={{ border: '2px solid rgba(229,9,20,0.3)' }}>
                          {review.author_details?.avatar_path ? (
                            <img
                              src={review.author_details.avatar_path.startsWith('/https')
                                ? review.author_details.avatar_path.slice(1)
                                : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                              alt={review.author}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                              style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)' }}>
                              {review.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-semibold text-sm">{review.author}</span>
                            {review.author_details?.rating && (
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.2)' }}>
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-yellow-400 text-xs font-bold">{review.author_details.rating}/10</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No reviews available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
