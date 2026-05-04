import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import MovieCard from '../../components/MovieCard';

const TMDB_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';

export default function CategoryScreen() {
  const { id, name, type } = useLocalSearchParams();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getEndpoint = () => {
    switch(id) {
      case 'trending': return 'trending/movie/week?';
      case 'popular_tv': return 'tv/popular?';
      case 'top_rated': return 'movie/top_rated?';
      case 'action': return 'discover/movie?with_genres=28&';
      case 'comedy': return 'discover/movie?with_genres=35&';
      case 'horror': return 'discover/movie?with_genres=27&';
      case 'scifi': return 'discover/tv?with_genres=10765&';
      case 'adult': return 'discover/movie?include_adult=true&certification_country=US&certification.lte=NC-17&with_genres=18,53&';
      default: return 'trending/movie/week?';
    }
  };

  const fetchMovies = async (pageNumber, isLoadMore = false) => {
    if (!hasMore) return;
    if (isLoadMore) setIsFetchingMore(true);
    
    try {
      const res = await fetch(`https://api.themoviedb.org/3/${getEndpoint()}api_key=${TMDB_KEY}&page=${pageNumber}`);
      const data = await res.json();
      
      const formatted = (data.results || []).map(m => ({
        id: m.id,
        title: m.title || m.name,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
        rating: m.vote_average?.toFixed(1),
        releaseDate: m.release_date || m.first_air_date,
        type: type || (m.title ? 'movie' : 'tv'),
      }));

      if (isLoadMore) {
        setResults(prev => [...prev, ...formatted]);
      } else {
        setResults(formatted);
      }

      setHasMore(data.page < data.total_pages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(1, false);
  }, [id]);

  const handleLoadMore = () => {
    if (!isFetchingMore && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage, true);
    }
  };
  // End of logic

  return (
    <View className="flex-1 bg-[#0a0a14] px-4 pt-12">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-white/10 rounded-full">
          <ArrowLeft color="white" size={20} />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-white">{name || 'Category'}</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#e50914" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
          ListFooterComponent={isFetchingMore ? (
            <ActivityIndicator size="small" color="#e50914" style={{ marginVertical: 20 }} />
          ) : null}
        />
      )}
    </View>
  );
}
