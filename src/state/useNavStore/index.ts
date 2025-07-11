import {create} from 'zustand';

interface NavStore {
  drawerNavigation: any | null;
  setDrawerNavigation: (nav: any) => void;
}

export const useNavStore = create<NavStore>(set => ({
  drawerNavigation: null,
  setDrawerNavigation: nav => set({drawerNavigation: nav}),
}));
