import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = '@myflix_watchlist';

export const getWatchlist = async () => {
  try {
    const data = await AsyncStorage.getItem(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addToWatchlist = async (item) => {
  try {
    const current = await getWatchlist();
    const exists = current.find(i => i.id === item.id);
    if (!exists) {
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify([...current, item]));
    }
  } catch (e) {
    console.error(e);
  }
};

export const removeFromWatchlist = async (id) => {
  try {
    const current = await getWatchlist();
    const updated = current.filter(i => i.id !== id);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
};

export const isInWatchlist = async (id) => {
  try {
    const current = await getWatchlist();
    return current.some(i => i.id === id);
  } catch {
    return false;
  }
};
