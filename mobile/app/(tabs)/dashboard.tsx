import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { PlayCircle, Bookmark, Search, TrendingUp, Trophy, Star, Film, Tv, ChevronRight, Info, Flame } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getWatchlist } from '../../utils/watchlist';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);
  const [movieCount, setMovieCount] = useState(0);
  const [tvCount, setTvCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getWatchlist().then(data => {
        setWatchlist(data);
        setMovieCount(data.filter(i => i.type === 'movie').length);
        setTvCount(data.filter(i => i.type === 'tv').length);
      });
    }, [])
  );

  const quickActions = [
    { label: 'Search Movies & TV', icon: Search, color: '#3b82f6', route: '/(tabs)/search' },
    { label: 'Trending This Week', icon: Flame, color: '#f97316', route: '/(tabs)/' },
    { label: 'Top Rated Movies', icon: Trophy, color: '#eab308', route: '/category/top_rated?name=Top Rated&type=movie' },
    { label: 'Action & Adventure', icon: Film, color: '#e50914', route: '/category/action?name=Action Movies&type=movie' },
    { label: 'Popular TV Shows', icon: Tv, color: '#8b5cf6', route: '/category/popular_tv?name=Popular TV Shows&type=tv' },
    { label: 'Adult / 18+', icon: Star, color: '#ec4899', route: '/category/adult?name=Adult 18%2B&type=movie' },
  ];

  return (
    <ScrollView className="flex-1 bg-[#0a0a14]" bounces={false} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <LinearGradient
        colors={['#1a0a1a', '#0a0a14']}
        className="px-5 pt-14 pb-6"
      >
        <Text className="text-gray-400 text-sm font-medium mb-1">Welcome back</Text>
        <Text className="text-white text-3xl font-black mb-1">
          My <Text className="text-red-500">Dashboard</Text>
        </Text>
        <Text className="text-gray-500 text-sm">Your personal MyFlix hub</Text>
      </LinearGradient>

      <View className="px-4 pb-12 gap-6">

        {/* Stats Card */}
        <View className="bg-[#11111a] rounded-2xl border border-white/5 overflow-hidden">
          <View className="px-5 pt-5 pb-4 border-b border-white/5">
            <Text className="text-white font-bold text-base">Your Library Stats</Text>
          </View>
          <View className="flex-row">
            <View className="flex-1 p-5 items-center border-r border-white/5">
              <View className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 items-center justify-center mb-3">
                <Bookmark color="#e50914" size={20} fill="#e50914" />
              </View>
              <Text className="text-white text-2xl font-black">{watchlist.length}</Text>
              <Text className="text-gray-500 text-xs mt-1">Saved Total</Text>
            </View>
            <View className="flex-1 p-5 items-center border-r border-white/5">
              <View className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 items-center justify-center mb-3">
                <Film color="#3b82f6" size={20} />
              </View>
              <Text className="text-white text-2xl font-black">{movieCount}</Text>
              <Text className="text-gray-500 text-xs mt-1">Movies</Text>
            </View>
            <View className="flex-1 p-5 items-center">
              <View className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 items-center justify-center mb-3">
                <Tv color="#8b5cf6" size={20} />
              </View>
              <Text className="text-white text-2xl font-black">{tvCount}</Text>
              <Text className="text-gray-500 text-xs mt-1">TV Shows</Text>
            </View>
          </View>
        </View>

        {/* Watchlist Preview */}
        <View className="bg-[#11111a] rounded-2xl border border-white/5">
          <View className="flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
            <View className="flex-row items-center gap-2">
              <Bookmark color="#e50914" size={18} fill="#e50914" />
              <Text className="text-white font-bold text-base">My Watchlist</Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={() => router.push('/(tabs)/watchlist')}
            >
              <Text className="text-red-400 text-xs font-semibold">View All</Text>
              <ChevronRight color="#f87171" size={14} />
            </TouchableOpacity>
          </View>

          {watchlist.length === 0 ? (
            <View className="p-5 items-center py-8">
              <Text className="text-gray-500 text-sm text-center">Nothing saved yet.</Text>
              <Text className="text-gray-600 text-xs text-center mt-1">Tap the bookmark icon on any movie or show!</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4">
              {watchlist.slice(0, 8).map((item, i) => (
                <TouchableOpacity
                  key={`${item.id}-${i}`}
                  className="mr-3"
                  onPress={() => router.push(`/${item.type}/${item.id}`)}
                >
                  <View className="w-20 h-28 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    {item.poster ? (
                      <ImageBackground
                        source={{ uri: item.poster }}
                        className="w-full h-full"
                        resizeMode="cover"
                      >
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.7)']}
                          className="absolute bottom-0 left-0 right-0 p-1"
                        >
                          <Text className="text-white text-[9px] font-bold" numberOfLines={2}>{item.title}</Text>
                        </LinearGradient>
                      </ImageBackground>
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500 text-[9px] text-center px-1" numberOfLines={3}>{item.title}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              {watchlist.length > 8 && (
                <TouchableOpacity
                  className="w-20 h-28 rounded-xl bg-white/5 border border-white/10 items-center justify-center"
                  onPress={() => router.push('/(tabs)/watchlist')}
                >
                  <Text className="text-red-400 text-xl font-black">+{watchlist.length - 8}</Text>
                  <Text className="text-gray-500 text-[10px] mt-1">more</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </View>

        {/* Quick Actions */}
        <View className="bg-[#11111a] rounded-2xl border border-white/5">
          <View className="flex-row items-center gap-2 px-5 pt-5 pb-4 border-b border-white/5">
            <TrendingUp color="#e50914" size={18} />
            <Text className="text-white font-bold text-base">Quick Actions</Text>
          </View>
          <View className="p-3 gap-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={i}
                  className="flex-row items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 active:bg-white/10"
                  onPress={() => router.push(action.route)}
                >
                  <View
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{ backgroundColor: `${action.color}20`, borderWidth: 1, borderColor: `${action.color}40` }}
                  >
                    <Icon color={action.color} size={18} />
                  </View>
                  <Text className="text-gray-200 text-sm font-medium flex-1">{action.label}</Text>
                  <ChevronRight color="#4b5563" size={16} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* About Card */}
        <View className="bg-[#11111a] rounded-2xl border border-white/5 p-5">
          <View className="flex-row items-center gap-2 mb-4">
            <Info color="#e50914" size={18} />
            <Text className="text-white font-bold text-base">About MyFlix</Text>
          </View>
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Version</Text>
              <Text className="text-gray-300 text-sm font-medium">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Data Source</Text>
              <Text className="text-gray-300 text-sm font-medium">TMDB API</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 text-sm">Streaming</Text>
              <Text className="text-gray-300 text-sm font-medium">embed.su · vidsrc</Text>
            </View>
            <View className="h-px bg-white/5 my-1" />
            <Text className="text-gray-600 text-xs text-center leading-5">
              This product uses the TMDB API but is not endorsed or certified by TMDB. For personal use only.
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
