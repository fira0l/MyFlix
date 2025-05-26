import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { path: "/", name: "Home" },
    { path: "/search", name: "Search" },
    { path: "/watched", name: "Watched" },
    { path: "/recommended", name: "Recommended" },
    { path: "/add-movie", name: "+ Add Movie" },
    user ? { path: "/dashboard", name: "Dashboard" } : null,
    user ? { path: "/profile", name: "Profile" } : null,
  ].filter(Boolean);

  return (
    <nav className="bg-gray-900 bg-opacity-90 backdrop-blur-md border-b border-gray-800 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
              MyFlix
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <motion.div
              key={link.path}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.path}
                className="text-gray-300 hover:text-red-400 transition-colors duration-300 font-medium"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}

          {/* User Section */}
          <div className="flex items-center ml-4 space-x-4">
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm hidden lg:block">
                    {user.email}
                  </span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm bg-gray-800 hover:bg-red-600 text-red-400 hover:text-white rounded-md transition-colors duration-300 border border-gray-700"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="px-3 py-1 text-sm text-gray-300 hover:text-white"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {user && (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold mr-4">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden mt-4 space-y-3"
        >
          {navLinks.map((link) => (
            <motion.div
              key={link.path}
              whileHover={{ x: 5 }}
              className="block py-2 px-4 rounded-lg hover:bg-gray-800"
            >
              <Link
                to={link.path}
                className="text-gray-300 hover:text-red-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          <div className="pt-2 border-t border-gray-800">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-800 text-red-400"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 px-4 rounded-lg hover:bg-gray-800 text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;