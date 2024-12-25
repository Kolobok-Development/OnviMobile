import {StoreSlice} from '../store.ts';

import {SelectedFilters} from '@components/BottomSheetViews/Filters/index.tsx';

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
  bottomSheetPosition: any;
  setBottomSheetPosition: (value: any) => void;
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (value: boolean) => void;
  location?: IUserLocation;
  setLocation: (value: IUserLocation) => void;
  transferBalanceModalVisible: boolean;
  toggleTransferBalanceModal: (val: boolean) => void;
}

const createAppSlice: StoreSlice<AppSlice> = set => ({
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
  transferBalanceModalVisible: false,
  toggleTransferBalanceModal: val =>
    set(state => ({
      ...state,
      transferBalanceModalVisible: val,
    })),
});

export default createAppSlice;
