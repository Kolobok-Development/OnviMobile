import {StoreSlice} from '../store.ts';
export interface AppSlice {
  filters: any[];
  setFilters: (values: any[]) => void;
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
}

const createAppSlice: StoreSlice<AppSlice> = set => ({
  filters: [],
  setFilters: (values: any[]) => set(state => ({...state, filters: values})),

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
});

export default createAppSlice;
