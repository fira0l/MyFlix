import { Tabs } from 'expo-router';
import React from 'react';
import { Home, LayoutDashboard, Search, Bookmark } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a14',
          borderTopColor: 'rgba(255,255,255,0.1)',
        },
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: '#6b7280',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color, focused }) => <Bookmark color={color} size={24} fill={focused ? color : 'transparent'} />,
        }}
      />
    </Tabs>
  );
}
