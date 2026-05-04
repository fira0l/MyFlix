import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search as SearchIcon, Film, Tv, X } from 'lucide-react-native';
import MovieCard from '../../components/MovieCard';
import { LinearGradient } from 'expo-linear-gradient';

const TMDB_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchMovies(query);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

  const searchMovies = async (searchQuery) => {
    setIsLoading(true);
    try {
      const endpoint = searchType === 'movie' ? 'search/movie' : 'search/tv';
      const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_KEY}&query=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const formattedResults = (data.results || []).map(item => ({
        id: item.id,
        tmdbId: item.id,
        title: item.title || item.name,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
        releaseDate: item.release_date || item.first_air_date,
        rating: item.vote_average?.toFixed(1) || 'N/A',
        type: searchType
      }));
      setResults(formattedResults);
    } catch (error) {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0a0a14] px-4 pt-12">
      <Text className="text-3xl font-black text-white mb-4">Discover</Text>
      
      {/* Search Bar */}
      <View className="bg-white/5 border border-white/10 rounded-xl flex-row items-center px-4 py-3 mb-4">
        <SearchIcon color="#6b7280" size={20} />
        <TextInput
          className="flex-1 text-white ml-3"
          placeholder={`Search ${searchType === 'movie' ? 'movies' : 'TV shows'}...`}
          placeholderTextColor="#6b7280"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X color="#9ca3af" size={20} />
          </TouchableOpacity>
        )}
      </View>

      {/* Type Toggles */}
      <View className="flex-row gap-4 mb-6">
        <TouchableOpacity 
          className="flex-1 rounded-xl overflow-hidden"
          onPress={() => setSearchType('movie')}
        >
          <LinearGradient
            colors={searchType === 'movie' ? ['#e50914', '#b8070f'] : ['transparent', 'transparent']}
            className={`flex-row items-center justify-center py-3 border ${searchType === 'movie' ? 'border-transparent' : 'border-white/10'}`}
          >
            <Film color="white" size={16} />
            <Text className="text-white font-bold ml-2">Movies</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 rounded-xl overflow-hidden"
          onPress={() => setSearchType('tv')}
        >
          <LinearGradient
            colors={searchType === 'tv' ? ['#7c3aed', '#6d28d9'] : ['transparent', 'transparent']}
            className={`flex-row items-center justify-center py-3 border ${searchType === 'tv' ? 'border-transparent' : 'border-white/10'}`}
          >
            <Tv color="white" size={16} />
            <Text className="text-white font-bold ml-2">TV Shows</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#e50914" />
        </View>
      ) : results.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {results.map((item) => (
              <View key={item.id} className="w-[31%]">
                <MovieCard
                  title={item.title}
                  poster={item.poster}
                  releaseDate={item.releaseDate}
                  rating={item.rating}
                  tmdbId={item.tmdbId}
                  type={item.type}
                  containerClassName="w-full"
                />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : query ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400">No results found for "{query}"</Text>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <SearchIcon color="#374151" size={48} className="mb-4" />
          <Text className="text-gray-500">Start searching...</Text>
        </View>
      )}
    </View>
  );
}
