import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Home";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import Dashboard from "./pages/Dashboard";
import AddMovie from "./pages/AddMovie";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from './pages/Profile';

function App() {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:title" element={<MovieDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />

          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
