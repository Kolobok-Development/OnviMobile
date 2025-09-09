import {getFavorites, postFavorites, removeFavorites} from '@services/api/user';
import {StoreSlice} from '../store';
import LocalStorage from '@services/local-storage';

export interface FavoritesSlice {
  favorites: number[];
  isLoading: boolean;
  addToFavorites: (id: number) => void;
  removeFromFavorites: (id: number) => void;
  loadFavorites: () => Promise<void>;
  isFavorite: (id: number) => boolean;
  refreshFavorites: () => Promise<void>;
}

const createFavoritesSlice: StoreSlice<FavoritesSlice> = (set, get) => ({
  favorites: [],
  isLoading: false,

  addToFavorites: async (id: number) => {
    try {
      const newFavorites = [...get().favorites, id];
      set({favorites: newFavorites});

      await LocalStorage.set('favorites', JSON.stringify(newFavorites));
      await postFavorites({carwashId: id});
    } catch (error) {
      const currentFavorites = get().favorites.filter(favId => favId !== id);
      set({favorites: currentFavorites});
      await LocalStorage.set('favorites', JSON.stringify(currentFavorites));
      throw error;
    }
  },

  removeFromFavorites: async (id: number) => {
    try {
      const newFavorites = get().favorites.filter(favId => favId !== id);
      set({favorites: newFavorites});

      await LocalStorage.set('favorites', JSON.stringify(newFavorites));
      await removeFavorites({carwashId: id});
    } catch (error) {
      const currentFavorites = [...get().favorites, id];
      set({favorites: currentFavorites});
      await LocalStorage.set('favorites', JSON.stringify(currentFavorites));
      throw error;
    }
  },

  loadFavorites: async () => {
    set({isLoading: true});
    try {
      const serverFavorites = await getFavorites();
      set({favorites: serverFavorites});

      await LocalStorage.set('favorites', JSON.stringify(serverFavorites));
    } catch (error) {
      const stored = await LocalStorage.getString('favorites');
      if (stored) {
        set({favorites: JSON.parse(stored)});
      }
      throw error;
    } finally {
      set({isLoading: false});
    }
  },

  refreshFavorites: async () => {
    await get().loadFavorites();
  },

  isFavorite: (id: number) => {
    return get().favorites.includes(id);
  },
});

export default createFavoritesSlice;
