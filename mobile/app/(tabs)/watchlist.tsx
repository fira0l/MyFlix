import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import MovieCard from '../../components/MovieCard';
import { getWatchlist } from '../../utils/watchlist';

export default function WatchlistScreen() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reload every time the tab is focused so additions are reflected instantly
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      getWatchlist().then(data => {
        setWatchlist(data);
        setIsLoading(false);
      });
    }, [])
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0a0a14] justify-center items-center">
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  if (watchlist.length === 0) {
    return (
      <View className="flex-1 bg-[#0a0a14] justify-center items-center px-8">
        <View className="w-24 h-24 rounded-full bg-white/5 border border-white/10 items-center justify-center mb-6">
          <Bookmark color="#e50914" size={40} />
        </View>
        <Text className="text-white text-2xl font-black text-center mb-3">Your Watchlist is Empty</Text>
        <Text className="text-gray-500 text-center leading-6 mb-8">
          Browse movies and TV shows, then tap the bookmark icon on any details page to save it here.
        </Text>
        <TouchableOpacity
          className="bg-red-600 px-8 py-3 rounded-xl"
          onPress={() => router.push('/')}
        >
          <Text className="text-white font-bold text-base">Discover Content</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0a0a14] px-4 pt-14">
      <View className="flex-row items-center gap-3 mb-6">
        <Bookmark color="#e50914" size={24} fill="#e50914" />
        <Text className="text-white text-2xl font-black">My Watchlist</Text>
        <View className="ml-auto bg-white/10 px-3 py-1 rounded-full">
          <Text className="text-gray-400 text-sm font-semibold">{watchlist.length} saved</Text>
        </View>
      </View>

      <FlatList
        data={watchlist}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => (
          <View className="w-[31%]">
            <MovieCard
              title={item.title}
              poster={item.poster}
              releaseDate={item.releaseDate}
              rating={item.rating}
              tmdbId={item.id}
              type={item.type}
              containerClassName="w-full"
            />
          </View>
        )}
      />
    </View>
  );
}
