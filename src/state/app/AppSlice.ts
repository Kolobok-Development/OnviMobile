import {StoreSlice} from '../store.ts';

import {SelectedFilters} from '@components/BottomSheetViews/Filters/index.tsx';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

export interface IUserLocation {
  latitude: number;
  longitude: number;
}

export interface AppSlice {
  filters: SelectedFilters;
  setFilters: (values: SelectedFilters) => void;
  news: any[];
  setNews: (values: any[]) => void;
  partners: any[];
  setPartners: (values: any[]) => void;
  isMainScreen: boolean;
  setIsMainScreen: (value: boolean) => void;
  showBurgerButton: boolean;
  setShowBurgerButton: (value: boolean) => void;
  bottomSheetPosition: any;
  setBottomSheetPosition: (value: any) => void;
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (value: boolean) => void;
  location?: IUserLocation;
  setLocation: (value: IUserLocation) => void;
  bottomSheetRef: React.RefObject<BottomSheetMethods> | null;
  setBottomSheetRef: (
    value: React.RefObject<BottomSheetMethods> | null,
  ) => void;
}

const createAppSlice: StoreSlice<AppSlice> = set => ({
  bottomSheetRef: null,
  setBottomSheetRef: value => set({bottomSheetRef: value}),
  filters: {},
  setFilters: (values: SelectedFilters) =>
    set(state => ({...state, filters: values})),
  news: [],
  setNews: (values: any[]) => set(state => ({...state, news: values})),
  partners: [],
  setPartners: (values: any[]) => set(state => ({...state, partners: values})),
  isMainScreen: true,
  setIsMainScreen: (value: boolean) =>
    set(state => ({...state, isMainScreen: value})),
  bottomSheetPosition: null,
  setBottomSheetPosition: (value: any) =>
    set(state => ({...state, bottomSheetPosition: value})),
  isBottomSheetOpen: false,
  setIsBottomSheetOpen: (value: boolean) =>
    set(state => ({...state, isBottomSheetOpen: value})),
  location: undefined,
  setLocation: (value: IUserLocation) =>
    set(state => ({...state, location: value})),
  showBurgerButton: true,
  setShowBurgerButton: (value: boolean) =>
    set(state => ({...state, showBurgerButton: value})),
});

export default createAppSlice;
