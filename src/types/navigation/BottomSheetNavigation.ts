import {NavigationProp, RouteProp} from '@react-navigation/native';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Campaign, NewsPost, Price, Tag} from '../api/app/types.ts';

export type RootStackParamList = {
  Main: {
    drawerNavigation?: any;
    active?: boolean;
  };
  Search: {
    setCamera: (val?: {longitude: number; latitude: number}) => void;
  };
  Filters: {};
  Business: {};
  BusinessInfo: {
    tags?: Tag[];
  };
  Boxes: {
    active?: boolean;
    boxes?: {
      number: number;
    }[];
    price?: Price[];
    bayType: string;
  };
  Launch: {
    bayType: string;
    active?: boolean;
  };
  Notifications: {};
  History: {
    drawerNavigation?: any;
    type: string;
  };
  Payment: {};
  AddCard: {};
  Settings: {};
  Post: {
    data?: NewsPost | null;
  };
  Campaign: {
    data?: Campaign | null;
  };
  About: {};
};

export type GeneralBottomSheetNavigationProp<
  T extends keyof RootStackParamList,
> = NavigationProp<RootStackParamList, T>;

export type GeneralBottomSheetRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;
