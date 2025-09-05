import {StoreSlice} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoritesSlice {
  favorites: number[];
  isLoading: boolean;
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
  loadFavorites: () => Promise<void>;
  isFavorite: (id: number) => boolean;
}

const createFavoritesSlice: StoreSlice<FavoritesSlice> = (set, get) => ({
  favorites: [],
  isLoading: false,

  addToFavorites: (id: number) => {
    const newFavorites = [...get().favorites, id];
    set({favorites: newFavorites});
    AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  },

  removeFromFavorites: (id: number) => {
    const newFavorites = get().favorites.filter(favId => favId !== id);
    set({favorites: newFavorites});
    AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  },

  loadFavorites: async () => {
    set({isLoading: true});
    try {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) {
        set({favorites: JSON.parse(stored)});
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      set({isLoading: false});
    }
  },

  isFavorite: (id: number) => {
    return get().favorites.includes(id);
  },
});

export default createFavoritesSlice;
