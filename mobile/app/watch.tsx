import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Star, Share2, Bookmark, CheckCircle, Server, Tv, Play, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TMDB_KEY = '3fccfc43ac857c99ed340ba2c03bd1e9';
const { width } = Dimensions.get('window');

export default function WatchScreen() {
  const { id, type, s = '1', e = '1' } = useLocalSearchParams();
  const router = useRouter();
  
  const [currentSource, setCurrentSource] = useState(0);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Fetch TMDB info
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_KEY}`)
      .then(res => res.json())
      .then(data => setDetails(data))
      .catch(() => {});
  }, [id, type]);

  const streamSources = type === 'movie' ? [
    `https://embed.su/embed/movie/${id}`,
    `https://autoembed.co/movie/tmdb/${id}`,
    `https://vidsrc.cc/v2/embed/movie/${id}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
    `https://vidsrc.to/embed/movie/${id}`
  ] : [
    `https://embed.su/embed/tv/${id}/${s}/${e}`,
    `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
    `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
    `https://vidsrc.to/embed/tv/${id}/${s}/${e}`
  ];

  const injectedJS = `
    // Basic popup blocker
    window.open = function() { return null; };
    
    // Attempt to remove overlays
    setInterval(function() {
      document.querySelectorAll('.ad-container, [id*="ads"], [class*="ad-"]').forEach(el => el.remove());
      const divs = document.querySelectorAll('div');
      divs.forEach(el => {
        const z = parseInt(window.getComputedStyle(el).zIndex);
        if (z > 999999) el.remove();
      });
    }, 1000);
    true;
  `;

  const handleShouldStartLoadWithRequest = (request) => {
    // We only want to prevent top-level navigation to popups.
    // Streaming sites use internal blobs and redirects that we MUST allow.
    if (!request.isTopFrame) return true;
    
    const url = request.url;
    const isKnownAd = url.includes('bet') || url.includes('casino') || url.includes('pop');
    
    // If it's trying to navigate the top frame away from the streaming site to an ad, block it.
    if (isKnownAd && !streamSources.includes(url)) {
      return false;
    }
    
    return true;
  };

  const handleNextEpisode = () => {
    router.replace(`/watch?id=${id}&type=tv&s=${s}&e=${Number(e) + 1}`);
  };

  const handlePrevEpisode = () => {
    if (Number(e) > 1) {
      router.replace(`/watch?id=${id}&type=tv&s=${s}&e=${Number(e) - 1}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a14]">
      {/* 16:9 Video Player Area */}
      <View style={{ width: width, height: width * (9/16) }} className="bg-black relative">
        {loading && (
          <View className="absolute inset-0 z-10 justify-center items-center bg-black">
            <ActivityIndicator size="large" color="#e50914" />
          </View>
        )}
        
        {/* Back Button Overlay */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-2 left-2 z-20 w-10 h-10 rounded-full bg-black/60 items-center justify-center"
        >
          <ArrowLeft color="white" size={20} />
        </TouchableOpacity>

        <WebView
          key={`${currentSource}-${s}-${e}`} // Force rerender on change
          source={{ uri: streamSources[currentSource] }}
          className="flex-1 bg-black"
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript={injectedJS}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          setSupportMultipleWindows={false}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Title & Meta */}
        <View className="px-4 py-6">
          <Text className="text-white text-2xl font-black mb-2">
            {details ? (details.title || details.name) : 'Loading...'}
          </Text>
          
          <View className="flex-row items-center flex-wrap gap-2 mb-6">
            {details && details.vote_average && (
              <View className="flex-row items-center gap-1">
                <Star color="#facc15" fill="#facc15" size={14} />
                <Text className="text-yellow-400 font-bold">{details.vote_average.toFixed(1)}</Text>
              </View>
            )}
            {type === 'tv' && (
              <View className="px-2 py-0.5 rounded bg-purple-600/20 border border-purple-500/50">
                <Text className="text-purple-400 text-xs font-bold">S{s} E{e}</Text>
              </View>
            )}
            <Text className="text-gray-400">
              {details && (details.release_date?.split('-')[0] || details.first_air_date?.split('-')[0])}
            </Text>
          </View>

          {/* Actions Bar (Skeuomorphic) */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity 
              className="flex-1 py-3 rounded-xl items-center justify-center flex-row gap-2"
              style={{
                backgroundColor: isBookmarked ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderColor: isBookmarked ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
              }}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark color={isBookmarked ? "#60a5fa" : "white"} fill={isBookmarked ? "#60a5fa" : "transparent"} size={18} />
              <Text className="text-white font-semibold text-sm">{isBookmarked ? 'Saved' : 'Save'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-1 py-3 rounded-xl items-center justify-center flex-row gap-2"
              style={{
                backgroundColor: isFinished ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                borderColor: isFinished ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.1)',
                shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
              }}
              onPress={() => setIsFinished(!isFinished)}
            >
              <CheckCircle color={isFinished ? "#4ade80" : "white"} size={18} />
              <Text className="text-white font-semibold text-sm">{isFinished ? 'Finished' : 'Mark Done'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-12 py-3 rounded-xl items-center justify-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
              }}
            >
              <Share2 color="white" size={18} />
            </TouchableOpacity>
          </View>

          {/* TV Navigation */}
          {type === 'tv' && (
            <View className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
              <View className="flex-row items-center gap-2 mb-3">
                <Tv color="#a78bfa" size={18} />
                <Text className="text-white font-bold">Episodes</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <TouchableOpacity 
                  onPress={handlePrevEpisode}
                  disabled={Number(e) <= 1}
                  className={`flex-row items-center gap-1 px-4 py-2 rounded-lg ${Number(e) <= 1 ? 'opacity-30' : 'bg-white/10'}`}
                >
                  <ChevronLeft color="white" size={16} />
                  <Text className="text-white font-semibold">Prev</Text>
                </TouchableOpacity>
                <Text className="text-purple-400 font-bold">S{s} • E{e}</Text>
                <TouchableOpacity 
                  onPress={handleNextEpisode}
                  className="flex-row items-center gap-1 px-4 py-2 rounded-lg bg-purple-600/30 border border-purple-500/50"
                >
                  <Text className="text-purple-300 font-semibold">Next</Text>
                  <ChevronRight color="#d8b4fe" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Source Selection */}
          <View className="mb-6">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-3">Streaming Sources</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {streamSources.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setCurrentSource(i); setLoading(true); }}
                  className="mr-3 rounded-xl overflow-hidden"
                >
                  <LinearGradient
                    colors={currentSource === i ? ['#e50914', '#b8070f'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
                    className={`flex-row items-center px-4 py-3 border ${currentSource === i ? 'border-transparent' : 'border-white/10'}`}
                  >
                    <Server color={currentSource === i ? "white" : "#9ca3af"} size={16} />
                    <Text className={`font-bold ml-2 ${currentSource === i ? 'text-white' : 'text-gray-400'}`}>
                      Source {i + 1}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Overview */}
          {details && details.overview && (
            <View>
              <Text className="text-gray-400 font-bold text-xs uppercase mb-2">Overview</Text>
              <Text className="text-gray-300 leading-6">{details.overview}</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
