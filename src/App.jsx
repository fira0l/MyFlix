import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Home";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import Dashboard from "./pages/Dashboard";
import AddMovie from "./pages/AddMovie";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from './pages/Profile';
import Watched from './pages/Watched';
import Recommended from './pages/Recommended';
import WatchMovie from './pages/WatchMovie';
import TVDetail from './pages/TVDetail';
import Watchlist from './pages/Watchlist';
import RecentlyWatched from './pages/RecentlyWatched';
import ContinueWatching from './pages/ContinueWatching';

function App() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:title" element={<MovieDetail />} />
          <Route path="/tv-detail" element={<TVDetail />} />
          <Route path="/watch" element={<WatchMovie />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/recently-watched" element={<RecentlyWatched />} />
          <Route path="/continue-watching" element={<ContinueWatching />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/watched" element={<Watched />} />
          <Route path="/recommended" element={<Recommended />} />

          {/* Add more routes as needed */}
        </Routes>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
