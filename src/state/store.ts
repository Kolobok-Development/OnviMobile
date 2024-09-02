import create, {StoreApi} from 'zustand';
import createAppSlice, {AppSlice} from './app/AppSlice.ts';
import createOrderSlice, {OrderSlice} from './order/OrderSlice.ts';
import createPoSSlice, {PosSlice} from './pos/PosSlice.ts';
import createUserSlice, {UserSlice} from './user/UserSlice.ts';
import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from 'zustand/middleware';
import LocalStorage from '@services/local-storage';

export type StoreState = AppSlice & OrderSlice & PosSlice & UserSlice;
export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState'],
) => T;

const ZustandMMKVStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    return LocalStorage.set(name, value);
  },
  getItem: (name: string) => {
    const value = LocalStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return LocalStorage.delete(name);
  },
};

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createAppSlice(set, get),
        ...createUserSlice(set, get),
        ...createPoSSlice(set, get),
        ...createOrderSlice(set, get),
      }),
      {
        name: 'store',
        storage: createJSONStorage(() => ZustandMMKVStorage),
      },
    ),
  ),
);

export default useStore;
