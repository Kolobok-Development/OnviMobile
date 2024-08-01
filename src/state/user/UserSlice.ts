import {StoreSlice} from '../store.ts';

export interface UserSlice {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any;
  setUser: (value: any) => void;
  accessToken: string;
  setAccessToken: (value: any) => void;
  refreshToken: string;
  setRefreshToken: (value: any) => void;
}

const createUserSlice: StoreSlice<UserSlice> = set => ({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) =>
    set(state => ({...state, isAuthenticated: value})),

  user: null,
  setUser: (value: any) => set(state => ({...state, user: value})),

  accessToken: '',
  setAccessToken: (value: string) =>
    set(state => ({...state, accessToken: value})),

  refreshToken: '',
  setRefreshToken: (value: string) =>
    set(state => ({...state, refreshToken: value})),
});

export default createUserSlice;
