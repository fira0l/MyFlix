import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MovieCard from '../../components/MovieCard';

const TMDB_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [heroItems, setHeroItems] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [topRated, setTopRated] = useState([]);
  
  // New Categories
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [scifiTv, setScifiTv] = useState([]);
  const [adultMovies, setAdultMovies] = useState([]);
  
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, tvRes, topRatedRes, actionRes, comedyRes, horrorRes, scifiRes, adultRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`),
          fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_KEY}`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=28`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=35`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=27`),
          fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_KEY}&with_genres=10765`),
          fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&include_adult=true&certification_country=US&certification.lte=NC-17&with_genres=18,53`)
        ]);

        const trendingData = await trendingRes.json();
        const tvData = await tvRes.json();
        const topRatedData = await topRatedRes.json();
        const actionData = await actionRes.json();
        const comedyData = await comedyRes.json();
        const horrorData = await horrorRes.json();
        const scifiData = await scifiRes.json();
        const adultData = await adultRes.json();

        const formatItem = (m, type) => ({
          id: m.id,
          title: m.title || m.name,
          overview: m.overview,
          backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : '',
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '',
          rating: m.vote_average?.toFixed(1),
          releaseDate: m.release_date || m.first_air_date,
          type: type,
        });

        const formattedTrending = (trendingData.results || []).map(m => formatItem(m, 'movie'));
        
        setHeroItems(formattedTrending.slice(0, 5));
        setTrendingMovies(formattedTrending.slice(5)); // The rest
        setPopularTv((tvData.results || []).map(m => formatItem(m, 'tv')));
        setTopRated((topRatedData.results || []).map(m => formatItem(m, 'movie')));
        setActionMovies((actionData.results || []).map(m => formatItem(m, 'movie')));
        setComedyMovies((comedyData.results || []).map(m => formatItem(m, 'movie')));
        setHorrorMovies((horrorData.results || []).map(m => formatItem(m, 'movie')));
        setScifiTv((scifiData.results || []).map(m => formatItem(m, 'tv')));
        setAdultMovies((adultData.results || []).map(m => formatItem(m, 'movie')));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / width);
    setActiveHeroIndex(currentIndex);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0a0a14] justify-center items-center">
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#0a0a14]" bounces={false}>
      {/* Swipeable Hero Carousel */}
      <View className="h-[550px] w-full relative">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {heroItems.map((featured, index) => (
            <View key={featured.id} style={{ width, height: 550 }}>
              <ImageBackground
                source={{ uri: featured.backdrop || featured.poster }}
                className="w-full h-full"
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['transparent', 'rgba(10,10,20,0.8)', '#0a0a14']}
                  className="absolute inset-0 flex justify-end px-6 pb-12"
                >
                  <View className="items-center">
                    <Text className="text-white text-4xl font-black text-center mb-2 shadow-lg" numberOfLines={2}>
                      {featured.title}
                    </Text>
                    
                    <View className="flex-row items-center gap-3 mb-6">
                      <Text className="text-yellow-400 font-bold">★ {featured.rating}</Text>
                      <Text className="text-gray-300">{featured.releaseDate?.split('-')[0]}</Text>
                      <View className="px-2 py-0.5 rounded bg-red-600/20 border border-red-500/50">
                        <Text className="text-red-400 text-xs font-bold">Movie</Text>
                      </View>
                    </View>

                    <View className="flex-row gap-4 w-full justify-center">
                      <TouchableOpacity 
                        className="bg-red-600 px-6 py-3 rounded-xl flex-row items-center gap-2 shadow-lg shadow-red-900/50"
                        onPress={() => router.push(`/watch?id=${featured.id}&type=${featured.type}`)}
                      >
                        <Play color="white" size={20} fill="white" />
                        <Text className="text-white font-bold text-lg">Play</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        className="bg-white/10 px-6 py-3 rounded-xl flex-row items-center gap-2 border border-white/20"
                        onPress={() => router.push(`/${featured.type}/${featured.id}`)}
                      >
                        <Info color="white" size={20} />
                        <Text className="text-white font-bold text-lg">Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
        
        {/* Pagination Dots */}
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
          {heroItems.map((_, i) => (
            <View 
              key={i} 
              className={`h-2 rounded-full ${activeHeroIndex === i ? 'w-6 bg-red-600' : 'w-2 bg-white/30'}`} 
            />
          ))}
        </View>
      </View>

      <View className="px-4 py-2 pb-12">
        {/* Trending List */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-white text-xl font-bold">Trending Movies</Text>
            <TouchableOpacity onPress={() => router.push('/category/trending?name=Trending Movies&type=movie')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {trendingMovies.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

        {/* Popular TV List */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-white text-xl font-bold">Popular TV Shows</Text>
            <TouchableOpacity onPress={() => router.push('/category/popular_tv?name=Popular TV Shows&type=tv')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {popularTv.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

        {/* Top Rated List */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-white text-xl font-bold">Top Rated</Text>
            <TouchableOpacity onPress={() => router.push('/category/top_rated?name=Top Rated Movies&type=movie')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {topRated.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

        {/* Action Movies */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-white text-xl font-bold">Action & Adventure</Text>
            <TouchableOpacity onPress={() => router.push('/category/action?name=Action Movies&type=movie')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {actionMovies.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

        {/* Comedy Movies */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-white text-xl font-bold">Comedies</Text>
            <TouchableOpacity onPress={() => router.push('/category/comedy?name=Comedy Movies&type=movie')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {comedyMovies.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

        {/* Sci-Fi TV */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-white text-xl font-bold">Sci-Fi & Fantasy Shows</Text>
            <TouchableOpacity onPress={() => router.push('/category/scifi?name=Sci-Fi TV&type=tv')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {scifiTv.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

        {/* Horror */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-white text-xl font-bold">Horror</Text>
            <TouchableOpacity onPress={() => router.push('/category/horror?name=Horror Movies&type=movie')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {horrorMovies.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

        {/* Adult Content */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1 border-t border-red-500/20 pt-6">
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-xl font-bold">Adult / 18+</Text>
              <View className="px-2 py-0.5 rounded bg-red-600/20 border border-red-500/50">
                <Text className="text-red-400 text-[10px] font-bold">NC-17</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/category/adult?name=Adult 18%2B&type=movie')}>
              <Text className="text-red-500 font-semibold text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {adultMovies.map((item) => (
              <MovieCard key={item.id} title={item.title} poster={item.poster} releaseDate={item.releaseDate} rating={item.rating} tmdbId={item.id} type={item.type} />
            ))}
          </ScrollView>
        </View>

      </View>

    </ScrollView>
  );
}
