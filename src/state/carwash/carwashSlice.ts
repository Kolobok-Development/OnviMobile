import {getFavorites, postFavorites, removeFavorites} from '@services/api/user';
import {StoreSlice} from '../store';
import LocalStorage from '@services/local-storage';
import {getLatestCarwash} from '@services/api/order';

export interface CarwashSlice {
  favoritesCarwashes: number[];
  latestCarwashes: number[];
  isLoading: boolean;
  addToFavoritesCarwashes: (id: number) => void;
  removeFromFavoritesCarwashes: (id: number) => void;
  loadFavoritesCarwashes: () => Promise<void>;
  loadLatestCarwashes: () => Promise<void>;
  isFavoriteCarwash: (id: number) => boolean;
  refreshFavoritesCarwashes: () => Promise<void>;
}

const createCarwashSlice: StoreSlice<CarwashSlice> = (set, get) => ({
  favoritesCarwashes: [],
  latestCarwashes: [],
  isLoading: false,

  addToFavoritesCarwashes: async (id: number) => {
    try {
      const newFavorites = [...get().favoritesCarwashes, id];
      set({favoritesCarwashes: newFavorites});

      await LocalStorage.set('favorites', JSON.stringify(newFavorites));
      await postFavorites({carwashId: id});
    } catch (error) {
      const currentFavorites = get().favoritesCarwashes.filter(
        favId => favId !== id,
      );
      set({favoritesCarwashes: currentFavorites});
      await LocalStorage.set('favorites', JSON.stringify(currentFavorites));
      throw error;
    }
  },

  removeFromFavoritesCarwashes: async (id: number) => {
    try {
      const newFavorites = get().favoritesCarwashes.filter(
        favId => favId !== id,
      );
      set({favoritesCarwashes: newFavorites});

      await LocalStorage.set('favorites', JSON.stringify(newFavorites));
      await removeFavorites({carwashId: id});
    } catch (error) {
      const currentFavorites = [...get().favoritesCarwashes, id];
      set({favoritesCarwashes: currentFavorites});
      await LocalStorage.set('favorites', JSON.stringify(currentFavorites));
      throw error;
    }
  },

  loadFavoritesCarwashes: async () => {
    set({isLoading: true});
    try {
      const serverFavorites = await getFavorites();
      set({favoritesCarwashes: serverFavorites});

      await LocalStorage.set('favorites', JSON.stringify(serverFavorites));
    } catch (error) {
      const stored = await LocalStorage.getString('favorites');
      if (stored) {
        set({favoritesCarwashes: JSON.parse(stored)});
      }
      throw error;
    } finally {
      set({isLoading: false});
    }
  },

  refreshFavoritesCarwashes: async () => {
    await get().loadFavoritesCarwashes();
  },

  isFavoriteCarwash: (id: number) => {
    return get().favoritesCarwashes.includes(id);
  },

  loadLatestCarwashes: async () => {
    set({isLoading: true});
    try {
      const serverLatest = await getLatestCarwash({size: 3, page: 1});

      set({latestCarwashes: serverLatest});

      await LocalStorage.set('latest', JSON.stringify(serverLatest));
    } catch (error) {
      const stored = await LocalStorage.getString('latest');
      if (stored) {
        set({latestCarwashes: JSON.parse(stored)});
      }
      throw error;
    } finally {
      set({isLoading: false});
    }
  },
});

export default createCarwashSlice;
