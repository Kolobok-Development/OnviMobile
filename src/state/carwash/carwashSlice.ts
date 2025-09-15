import {getFavorites, postFavorites, removeFavorites} from '@services/api/user';
import {StoreSlice} from '../store';
import LocalStorage from '@services/local-storage';
import {getLatestCarwash} from '@services/api/order';

export interface CarwashSlice {
  favoritesCarwashes: number[];
  latestCarwashes: number[];
  clipCarwashes: number[];
  favoritesCarwashesIsLoading: boolean;
  latestCarwashesIsLoading: boolean;
  addToFavoritesCarwashes: (id: number) => void;
  removeFromFavoritesCarwashes: (id: number) => void;
  loadFavoritesCarwashes: () => Promise<void>;
  loadLatestCarwashes: () => Promise<void>;
  isFavoriteCarwash: (id: number) => boolean;
  refreshFavoritesCarwashes: () => Promise<void>;
  addToClipCarwashes: (id: number) => void;
  removeFromClipCarwashes: (id: number) => void;
  isClipCarwash: (id: number) => boolean;
  loadClipCarwashes: () => Promise<void>;
}

const createCarwashSlice: StoreSlice<CarwashSlice> = (set, get) => ({
  favoritesCarwashes: [],
  latestCarwashes: [],
  clipCarwashes: [],
  favoritesCarwashesIsLoading: false,
  latestCarwashesIsLoading: false,

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
    set({favoritesCarwashesIsLoading: true});
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
      set({favoritesCarwashesIsLoading: false});
    }
  },

  refreshFavoritesCarwashes: async () => {
    await get().loadFavoritesCarwashes();
  },

  isFavoriteCarwash: (id: number) => {
    return get().favoritesCarwashes.includes(id);
  },

  loadLatestCarwashes: async () => {
    set({latestCarwashesIsLoading: true});
    try {
      const serverLatest = await getLatestCarwash({size: 3, page: 1});

      set({latestCarwashes: serverLatest});

      await get().loadClipCarwashes();
      await LocalStorage.set('latest', JSON.stringify(serverLatest));
    } catch (error) {
      const stored = await LocalStorage.getString('latest');
      if (stored) {
        set({latestCarwashes: JSON.parse(stored)});
      }
      throw error;
    } finally {
      set({latestCarwashesIsLoading: false});
    }
  },

  addToClipCarwashes: async (id: number) => {
    try {
      const newClip = [id, ...get().clipCarwashes];
      set({clipCarwashes: newClip});

      await LocalStorage.set('clip', JSON.stringify(newClip));
    } catch (error) {
      const currentClip = get().clipCarwashes.filter(clipId => clipId !== id);
      set({clipCarwashes: currentClip});
      throw error;
    }
  },

  removeFromClipCarwashes: async (id: number) => {
    try {
      const newClip = get().clipCarwashes.filter(clipId => clipId !== id);
      set({clipCarwashes: newClip});

      await LocalStorage.set('clip', JSON.stringify(newClip));
    } catch (error) {
      const currentClip = [...get().clipCarwashes, id];
      set({clipCarwashes: currentClip});
      await LocalStorage.set('clip', JSON.stringify(currentClip));
      throw error;
    }
  },

  isClipCarwash: (id: number) => {
    return get().clipCarwashes.includes(id);
  },

  loadClipCarwashes: async () => {
    try {
      const stored = await LocalStorage.getString('clip');

      if (stored) {
        set({clipCarwashes: JSON.parse(stored)});
      }
    } catch (error) {
      throw error;
    }
  },
});

export default createCarwashSlice;
