import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Play, Bookmark, Film } from 'lucide-react-native';

const MovieCard = ({
  title,
  poster,
  releaseDate,
  rating,
  genres = [],
  overview,
  trailerUrl,
  tmdbId,
  type = 'movie',
  containerClassName = "w-36 mr-4"
}) => {
  const router = useRouter();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'N/A';

  const handleCardClick = () => {
    if (type === 'tv' && tmdbId) {
      router.push(`/tv/${tmdbId}`);
    } else if (tmdbId) {
      router.push(`/movie/${tmdbId}`);
    }
  };

  const handleWatch = (e) => {
    // Handle Watch directly
    router.push(`/watch?id=${tmdbId}&type=${type}${type === 'tv' ? '&s=1&e=1' : ''}`);
  };

  const handleWatchlist = async (e) => {
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <Pressable onPress={handleCardClick} className={`${containerClassName} relative rounded-xl overflow-hidden bg-gray-900`}>
      <View className="h-52 relative">
        {poster ? (
          <Image
            source={{ uri: poster }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full flex items-center justify-center bg-gray-800">
            <Film color="#4b5563" size={32} />
          </View>
        )}

        {/* Gradient overlay placeholder */}
        <View className="absolute inset-0 bg-black/40" />

        {/* Rating badge */}
        <View className="absolute top-2 left-2 flex-row items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 border border-white/10">
          <Star color="#facc15" fill="#facc15" size={12} />
          <Text className="text-white text-xs font-bold">{rating ?? 'N/A'}</Text>
        </View>

        {/* Type badge */}
        <View className={`absolute top-2 right-2 px-2 py-0.5 rounded-full ${type === 'tv' ? 'bg-purple-600' : 'bg-red-600'}`}>
          <Text className="text-white text-[10px] font-bold">{type === 'tv' ? 'TV' : 'Movie'}</Text>
        </View>

        {/* Bottom info */}
        <View className="absolute bottom-0 left-0 right-0 p-2">
          <Text className="text-white font-bold text-xs truncate mb-1" numberOfLines={1}>{title}</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-gray-400 text-[10px]">{releaseYear}</Text>
            {genres.length > 0 && (
              <View className="px-1.5 py-0.5 rounded-full bg-red-600/30">
                <Text className="text-[10px] text-red-400">{genres[0]}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default MovieCard;
