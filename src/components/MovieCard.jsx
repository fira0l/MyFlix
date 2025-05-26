import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaHeart, FaRegHeart, FaEye, FaRegEye, FaShare } from 'react-icons/fa';

const MovieCard = ({
  title,
  poster,
  releaseDate,
  rating,
  genres = [],
  overview,
  trailerUrl
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

  const handleClick = () => {
    navigate(`/movie/${encodeURIComponent(title)}`, {
      state: {
        title,
        poster,
        releaseDate,
        rating,
        genres,
        overview,
        trailerUrl
      },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative group"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 rounded-xl z-10 pointer-events-none" />
      
      {/* Movie Poster */}
      <img
        src={poster}
        alt={title}
        className="w-full h-96 object-cover rounded-xl group-hover:brightness-110 transition-all duration-300"
        loading="lazy"
      />
      
      {/* Movie Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold truncate">{title}</h3>
          <div className="flex items-center bg-gray-900 bg-opacity-70 px-2 py-1 rounded-full">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{rating ?? 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {genres.slice(0, 2).map((genre, index) => (
            <span key={index} className="text-xs bg-gray-900 bg-opacity-70 px-2 py-1 rounded">
              {genre}
            </span>
          ))}
          <span className="text-xs bg-gray-900 bg-opacity-70 px-2 py-1 rounded">
            {releaseYear}
          </span>
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-2 mb-4">{overview || 'No description available.'}</p>
        
        {/* Action Buttons - Only shown on hover */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="flex justify-center gap-3 transition-opacity duration-300"
        >
          <button
            className="p-2 bg-gray-900 bg-opacity-70 hover:bg-opacity-100 rounded-full transition-all"
            title="Mark as watched"
            onClick={(e) => {
              e.stopPropagation();
              // Handle watched action
            }}
          >
            <FaEye className="text-white" />
          </button>
          
          <button
            className="p-2 bg-gray-900 bg-opacity-70 hover:bg-opacity-100 rounded-full transition-all"
            title="Like this movie"
            onClick={(e) => {
              e.stopPropagation();
              // Handle like action
            }}
          >
            <FaHeart className="text-white" />
          </button>
          
          <button
            className="p-2 bg-gray-900 bg-opacity-70 hover:bg-opacity-100 rounded-full transition-all"
            title="Share this movie"
            onClick={(e) => {
              e.stopPropagation();
              // Handle share action
            }}
          >
            <FaShare className="text-white" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MovieCard;