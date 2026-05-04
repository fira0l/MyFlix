import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Home, Search, Star, Plus, LayoutDashboard, User, Bookmark, Clock, PlayCircle, LogOut, ChevronDown } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userChanged', handleStorageChange);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event('userChanged'));
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const mainLinks = [
    { path: "/", name: "Home", icon: Home },
    { path: "/search", name: "Search", icon: Search },
    { path: "/recommended", name: "Trending", icon: Star },
  ];

  const userLinks = [
    { path: '/continue-watching', name: 'Continue Watching', icon: PlayCircle },
    { path: '/watchlist', name: 'My Collection', icon: Bookmark },
    { path: '/recently-watched', name: 'Recently Watched', icon: Clock },
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', name: 'Profile', icon: User },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(8,8,16,0.97)'
            : 'rgba(8,8,16,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #ff4444, #e50914, #b8070f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 12px rgba(229,9,20,0.5))',
                }}>
                MyFlix
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link key={link.path} to={link.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: active ? 'rgba(229,9,20,0.15)' : 'transparent',
                      color: active ? '#ff6b6b' : '#9ca3af',
                      border: active ? '1px solid rgba(229,9,20,0.25)' : '1px solid transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}

              {/* User dropdown links */}
              {user && userLinks.slice(0, 3).map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link key={link.path} to={link.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: active ? 'rgba(229,9,20,0.15)' : 'transparent',
                      color: active ? '#ff6b6b' : '#9ca3af',
                      border: active ? '1px solid rgba(229,9,20,0.25)' : '1px solid transparent',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* More dropdown */}
                  <div className="hidden md:block relative" onClick={e => e.stopPropagation()}>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all"
                      style={{ background: isDropdownOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      More
                      <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 py-2 rounded-2xl overflow-hidden"
                        style={{
                          background: 'linear-gradient(145deg, #1a1a2e, #16213e)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
                        }}>
                        {userLinks.slice(3).map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link key={link.path} to={link.path}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Icon className="w-4 h-4 text-red-400" />
                              {link.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)', boxShadow: '0 2px 8px rgba(229,9,20,0.4)' }}>
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-300 text-xs max-w-24 truncate hidden lg:block">{user.email.split('@')[0]}</span>
                    </div>

                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 transition-all"
                      style={{ background: 'rgba(229,9,20,0.08)', border: '1px solid rgba(229,9,20,0.15)' }}
                      onClick={handleLogout}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Login
                  </Link>
                  <Link to="/signup">
                    <button className="skeu-btn px-4 py-2 rounded-xl text-white text-sm font-bold">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-6 pb-6 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>

            {/* All links */}
            <div className="space-y-1 mb-4">
              {[...mainLinks, ...(user ? userLinks : [])].map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link key={link.path} to={link.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: active ? 'rgba(229,9,20,0.15)' : 'rgba(255,255,255,0.03)',
                      color: active ? '#ff6b6b' : '#9ca3af',
                      border: `1px solid ${active ? 'rgba(229,9,20,0.25)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Auth section */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: 'linear-gradient(145deg, #e50914, #b8070f)' }}>
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-300 text-sm">{user.email.split('@')[0]}</span>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-400 transition-all"
                    style={{ background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)' }}
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-300 transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <button className="skeu-btn w-full py-2.5 rounded-xl text-white text-sm font-bold">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
