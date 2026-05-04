import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Star, ArrowLeft, User, Bookmark, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/watchlist';

const TMDB_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';

export default function TvDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tv, setTv] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    isInWatchlist(Number(id)).then(setBookmarked);
  }, [id]);

  const toggleWatchlist = async () => {
    if (bookmarked) {
      await removeFromWatchlist(Number(id));
      setBookmarked(false);
    } else {
      await addToWatchlist({
        id: Number(id),
        title: tv?.name,
        poster: tv?.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : '',
        rating: tv?.vote_average?.toFixed(1),
        releaseDate: tv?.first_air_date,
        type: 'tv',
      });
      setBookmarked(true);
    }
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_KEY}&append_to_response=videos,credits`)
      .then(res => res.json())
      .then(data => {
        setTv(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#0a0a14] justify-center items-center">
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  if (!tv) return null;

  const backdrop = tv.backdrop_path ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}` : null;
  const poster = tv.poster_path ? `https://image.tmdb.org/t/p/w500${tv.poster_path}` : null;

  return (
    <ScrollView className="flex-1 bg-[#0a0a14]" bounces={false}>
      {/* Hero */}
      <View className="h-96 w-full relative">
        <ImageBackground source={{ uri: backdrop || poster }} className="w-full h-full" resizeMode="cover">
          <LinearGradient
            colors={['rgba(10,10,20,0.8)', 'transparent', '#0a0a14']}
            className="absolute inset-0 justify-between px-4 py-12"
          >
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-black/50 items-center justify-center border border-white/10">
              <ArrowLeft color="white" size={20} />
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View className="px-4 -mt-20">
        <View className="flex-row gap-4 mb-6">
          <View className="w-32 h-48 rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <ImageBackground source={{ uri: poster }} className="w-full h-full" />
          </View>
          <View className="flex-1 justify-end pb-2">
            <Text className="text-white text-2xl font-black mb-2">{tv.name}</Text>
            <View className="flex-row items-center gap-2 flex-wrap">
              <View className="flex-row items-center gap-1">
                <Star color="#facc15" fill="#facc15" size={14} />
                <Text className="text-yellow-400 font-bold">{tv.vote_average?.toFixed(1)}</Text>
              </View>
              <Text className="text-gray-400">{tv.first_air_date?.split('-')[0]}</Text>
              <View className="px-2 py-0.5 rounded bg-purple-600/20 border border-purple-500/50">
                <Text className="text-purple-400 text-xs font-bold">TV</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity 
            className="flex-1 bg-purple-600 rounded-xl py-4 flex-row items-center justify-center gap-2 shadow-lg shadow-purple-900/50"
            onPress={() => router.push(`/watch?id=${id}&type=tv&s=1&e=1`)}
          >
            <Play color="white" fill="white" size={20} />
            <Text className="text-white font-bold text-lg">Watch S1 E1</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={toggleWatchlist}
            className={`w-14 rounded-xl items-center justify-center border ${ bookmarked ? 'bg-green-600/20 border-green-500/50' : 'bg-white/10 border-white/20' }`}
          >
            {bookmarked 
              ? <Check color="#4ade80" size={22} />
              : <Bookmark color="white" size={22} />}
          </TouchableOpacity>
        </View>

        <Text className="text-white text-lg font-bold mb-2">Overview</Text>
        <Text className="text-gray-400 leading-6 mb-6">{tv.overview}</Text>
        
        {/* Seasons */}
        <Text className="text-white text-lg font-bold mb-3">Seasons</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
          {tv.seasons?.map(s => {
            if (s.season_number === 0) return null;
            return (
              <TouchableOpacity 
                key={s.id}
                className="bg-white/5 border border-white/10 p-4 rounded-xl mr-3 w-32"
                onPress={() => router.push(`/watch?id=${id}&type=tv&s=${s.season_number}&e=1`)}
              >
                <Text className="text-white font-bold mb-1">Season {s.season_number}</Text>
                <Text className="text-gray-500 text-xs">{s.episode_count} Episodes</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Cast Section */}
        {tv.credits?.cast?.length > 0 && (
          <View className="mb-8">
            <Text className="text-white text-lg font-bold mb-3">Top Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tv.credits.cast.slice(0, 10).map(person => (
                <View key={person.id} className="mr-4 items-center w-20">
                  <View className="w-16 h-16 rounded-full overflow-hidden bg-white/10 border border-white/20 mb-2 items-center justify-center">
                    {person.profile_path ? (
                      <ImageBackground source={{ uri: `https://image.tmdb.org/t/p/w200${person.profile_path}` }} className="w-full h-full" />
                    ) : (
                      <User color="#9ca3af" size={24} />
                    )}
                  </View>
                  <Text className="text-white font-semibold text-xs text-center" numberOfLines={1}>{person.name}</Text>
                  <Text className="text-gray-500 text-[10px] text-center" numberOfLines={1}>{person.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Trailer Section */}
        {tv.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') && (
          <View className="mb-8">
            <Text className="text-white text-lg font-bold mb-3">Official Trailer</Text>
            <View className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
              <WebView
                originWhitelist={['*']}
                source={{ 
                  html: `<html><body style="margin:0;padding:0;background-color:#000;"><iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/${tv.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube').key}?rel=0" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></body></html>`,
                  baseUrl: 'https://www.youtube.com'
                }}
                className="flex-1"
                allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                scrollEnabled={false}
              />
            </View>
          </View>
        )}

      </View>
    </ScrollView>
  );
}
