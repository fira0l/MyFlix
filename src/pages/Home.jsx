import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Star, TrendingUp, Tv, Film, ChevronRight, ChevronLeft, Bookmark, Clock, PlayCircle, Info, Download, Smartphone } from 'lucide-react';
import { userAPI } from '../services/api';

const TMDB_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flat-card p-6 group hover:border-red-500/30 transition-all duration-300">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
      style={{ background: 'linear-gradient(145deg, rgba(229,9,20,0.2), rgba(184,7,15,0.1))', border: '1px solid rgba(229,9,20,0.3)' }}>
      <Icon className="w-5 h-5 text-red-500" />
    </div>
    <h3 className="text-white font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    if (storedUser) {
      Promise.all([userAPI.getContinueWatching(), userAPI.getWatchlist()])
        .then(([c, w]) => { setContinueWatching(c.slice(0, 3)); setWatchlist(w.slice(0, 3)); })
        .catch(() => {});
    }

    // Fetch trending movies for carousel
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`)
      .then(r => r.json())
      .then(data => {
        const items = data.results?.slice(0, 8).map(m => ({
          id: m.id,
          tmdbId: m.id,
          title: m.title,
          overview: m.overview,
          backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          rating: m.vote_average?.toFixed(1),
          releaseYear: m.release_date?.split('-')[0],
          type: 'movie',
        })) || [];
        setCarouselItems(items);
      })
      .catch(() => {});
  }, []);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % carouselItems.length);
  }, [currentSlide, carouselItems.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + carouselItems.length) % carouselItems.length);
  }, [currentSlide, carouselItems.length, goToSlide]);

  // Auto-advance carousel
  useEffect(() => {
    if (carouselItems.length === 0) return;
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, carouselItems.length]);

  const featured = carouselItems[currentSlide];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a14 0%, #0d0d1a 50%, #0a0a14 100%)' }}>

      {/* ===== HERO CAROUSEL ===== */}
      <section className="relative h-screen overflow-hidden">
        {/* Backdrop Images */}
        {carouselItems.map((item, i) => (
          <div key={item.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === currentSlide ? 1 : 0, zIndex: i === currentSlide ? 1 : 0 }}>
            {item.backdrop && (
              <img src={item.backdrop} alt={item.title}
                className="w-full h-full object-cover"
                style={{ opacity: 0.4 }}
              />
            )}
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(to right, rgba(8,8,16,0.95) 0%, rgba(8,8,16,0.6) 50%, rgba(8,8,16,0.3) 100%)'
        }} />
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(to top, rgba(8,8,16,1) 0%, transparent 40%)'
        }} />

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #e50914, transparent)', filter: 'blur(60px)' }} />

        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              {featured && (
                <div key={currentSlide} style={{ animation: 'fadeIn 0.6s ease-out' }}>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.35)' }}>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 text-sm font-semibold">🔥 Trending This Week</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
                    {featured.title}
                  </h1>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-bold">{featured.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{featured.releaseYear}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(229,9,20,0.2)', color: '#ff6b6b', border: '1px solid rgba(229,9,20,0.3)' }}>
                      Movie
                    </span>
                  </div>

                  {/* Overview */}
                  <p className="text-gray-300 text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
                    {featured.overview}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button className="skeu-btn px-8 py-4 rounded-xl text-white font-bold text-base flex items-center gap-3"
                      onClick={() => navigate('/watch', { state: { title: featured.title, tmdbId: featured.tmdbId, type: 'movie', poster: featured.poster, rating: featured.rating, overview: featured.overview } })}>
                      <Play className="w-5 h-5 fill-white" />
                      Watch Now
                    </button>
                    <button className="flat-btn px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-3"
                      onClick={() => navigate(`/movie/${encodeURIComponent(featured.title)}`, { state: { title: featured.title, tmdbId: featured.tmdbId, poster: featured.poster, rating: featured.rating, overview: featured.overview, genres: [] } })}>
                      <Info className="w-5 h-5" />
                      More Info
                    </button>
                    <a
                      href="https://expo.dev/artifacts/eas/68yaeJS7KHFUWeP6HGC6Qe.apk"
                      download
                      className="flex items-center gap-3 px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(145deg, rgba(34,197,94,0.2), rgba(22,163,74,0.1))', border: '1px solid rgba(34,197,94,0.4)', backdropFilter: 'blur(8px)' }}
                    >
                      <Download className="w-5 h-5 text-green-400" />
                      <span style={{ color: '#4ade80' }}>Download Mobile APK</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        {carouselItems.length > 0 && (
          <>
            {/* Prev/Next Buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              onClick={prevSlide}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              onClick={nextSlide}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-8 left-0 right-0 z-30 px-6">
              <div className="container mx-auto">
                <div className="flex items-end gap-3 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: 'none' }}>
                  {carouselItems.map((item, i) => (
                    <button key={item.id}
                      className="flex-shrink-0 transition-all duration-300 rounded-xl overflow-hidden"
                      style={{
                        width: i === currentSlide ? '100px' : '70px',
                        height: i === currentSlide ? '60px' : '48px',
                        boxShadow: i === currentSlide ? '0 0 0 2px #e50914, 0 4px 12px rgba(229,9,20,0.4)' : '0 2px 8px rgba(0,0,0,0.5)',
                        opacity: i === currentSlide ? 1 : 0.5,
                      }}
                      onClick={() => goToSlide(i)}
                    >
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    </button>
                  ))}

                  {/* Dot indicators */}
                  <div className="flex items-center gap-2 ml-4 mb-1">
                    {carouselItems.map((_, i) => (
                      <button key={i}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: i === currentSlide ? '24px' : '6px',
                          height: '6px',
                          background: i === currentSlide ? '#e50914' : 'rgba(255,255,255,0.3)',
                        }}
                        onClick={() => goToSlide(i)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fallback hero if no carousel */}
        {carouselItems.length === 0 && (
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)' }}>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-sm font-medium">Now Streaming</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
                  <span className="text-white">Watch</span><br />
                  <span className="gradient-text">Anything.</span><br />
                  <span className="text-white">Anytime.</span>
                </h1>
                <div className="flex flex-wrap gap-4">
                  <Link to={user ? '/search' : '/signup'}>
                    <button className="skeu-btn px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center gap-3">
                      <Play className="w-5 h-5 fill-white" />
                      {user ? 'Browse Content' : 'Get Started Free'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* User Dashboard */}
      {user && (
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">
              Welcome back, <span className="text-red-500">{user.email.split('@')[0]}</span> 👋
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="skeu-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-red-500" />
                    <h3 className="text-white font-semibold">Continue Watching</h3>
                  </div>
                  <Link to="/continue-watching" className="text-red-400 text-xs hover:text-red-300 flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {continueWatching.length > 0 ? (
                  <div className="space-y-3">
                    {continueWatching.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">Nothing in progress</p>}
              </div>

              <div className="skeu-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-red-500" />
                    <h3 className="text-white font-semibold">My Watchlist</h3>
                  </div>
                  <Link to="/watchlist" className="text-red-400 text-xs hover:text-red-300 flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                {watchlist.length > 0 ? (
                  <div className="space-y-3">
                    {watchlist.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">No saved items</p>}
              </div>

              <div className="skeu-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-red-500" />
                  <h3 className="text-white font-semibold">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Search Movies & TV', to: '/search' },
                    { label: 'Recently Watched', to: '/recently-watched' },
                    { label: 'Trending', to: '/recommended' },
                  ].map((action, i) => (
                    <Link key={i} to={action.to}
                      className="flex items-center justify-between p-2 rounded-lg text-gray-300 text-sm hover:text-white hover:bg-white/5 transition-all">
                      {action.label}
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-4">Everything You <span className="gradient-text">Need</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">A complete streaming experience built for movie lovers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Film} title="Movies & TV Shows" description="Stream thousands of movies and TV shows with season and episode selection." />
            <FeatureCard icon={Star} title="Real Reviews & Cast" description="Get real cast information, trailers, and user reviews powered by TMDB." />
            <FeatureCard icon={Bookmark} title="Watchlist" description="Save content to your personal watchlist and never miss a movie again." />
            <FeatureCard icon={PlayCircle} title="Continue Watching" description="Pick up exactly where you left off with smart progress tracking." />
            <FeatureCard icon={Clock} title="Watch History" description="Keep track of everything you've watched with timestamps." />
            <FeatureCard icon={TrendingUp} title="Trending Content" description="Discover popular and trending content curated just for you." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="glass-panel p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Film, value: '10K+', label: 'Movies Available' },
                { icon: Tv, value: '5K+', label: 'TV Shows' },
                { icon: Star, value: '4K', label: 'Ultra HD Quality' },
                { icon: PlayCircle, value: '3', label: 'Streaming Sources' },
              ].map(({ icon: Icon, value, label }, i) => (
                <div key={i} className="skeu-card p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)', boxShadow: '0 4px 12px rgba(229,9,20,0.4)' }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-xs text-gray-400 mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-24 px-6">
          <div className="container mx-auto text-center">
            <div className="skeu-card p-16 max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 opacity-5"
                style={{ background: 'radial-gradient(circle at center, #e50914, transparent)' }} />
              <h2 className="text-4xl font-black text-white mb-4 relative z-10">
                Ready to Start <span className="gradient-text">Watching?</span>
              </h2>
              <p className="text-gray-400 mb-10 text-lg relative z-10">Join thousands of movie lovers today.</p>
              <div className="flex flex-wrap gap-4 justify-center relative z-10">
                <Link to="/signup">
                  <button className="skeu-btn px-10 py-4 rounded-xl text-white font-bold text-lg">Create Free Account</button>
                </Link>
                <Link to="/login">
                  <button className="flat-btn px-10 py-4 rounded-xl text-white font-semibold text-lg">Sign In</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mobile App Download Banner */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="skeu-card p-10 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 opacity-5"
              style={{ background: 'radial-gradient(circle at 80% 50%, #22c55e, transparent)' }} />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Icon */}
              <div className="flex-shrink-0 w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: 'linear-gradient(145deg, rgba(34,197,94,0.25), rgba(22,163,74,0.1))', border: '1px solid rgba(34,197,94,0.4)' }}>
                <Smartphone className="w-12 h-12 text-green-400" />
              </div>
              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
                  ✨ Now Available
                </div>
                <h2 className="text-2xl font-black text-white mb-2">MyFlix Mobile App <span className="text-green-400">v0.0.1</span></h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Take MyFlix anywhere with our native Android app. Browse, bookmark, and stream your favourite movies and TV shows directly from your phone.
                </p>
              </div>
              {/* Download Button */}
              <a
                href="https://expo.dev/artifacts/eas/68yaeJS7KHFUWeP6HGC6Qe.apk"
                download
                className="flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                  boxShadow: '0 4px 20px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  color: 'white'
                }}
              >
                <Download className="w-5 h-5" />
                Download Mobile APK
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-black"
            style={{ background: 'linear-gradient(135deg, #e50914, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MyFlix
          </span>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} MyFlix. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/search" className="text-gray-500 hover:text-white text-sm transition-colors">Browse</Link>
            <Link to="/recommended" className="text-gray-500 hover:text-white text-sm transition-colors">Trending</Link>
            <Link to={user ? '/dashboard' : '/login'} className="text-gray-500 hover:text-white text-sm transition-colors">Account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
