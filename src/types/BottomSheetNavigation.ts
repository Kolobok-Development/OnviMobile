import {NavigationProp, RouteProp} from '@react-navigation/native';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Campaign, NewsPost, Price, Tag} from './api/app/types.ts';

export type RootStackParamList = {
  Main: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    drawerNavigation?: any;
    active?: boolean;
  };
  Search: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    setCamera: (val?: {longitude: number; latitude: number}) => void;
  };
  Filters: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
  };
  Business: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
  };
  BusinessInfo: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    tags?: Tag[];
  };
  Boxes: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    active?: boolean;
    boxes?: {
      number: number;
    }[];
    price?: Price[];
  };
  Launch: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    active?: boolean;
  };
  Notifications: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
  };
  History: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    drawerNavigation?: any;
    type: string;
  };
  Payment: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
  };
  AddCard: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
  };
  Settings: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
  };
  Post: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    data?: NewsPost | null;
  };
  Campaign: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
    data?: Campaign | null;
  };
  About: {
    bottomSheetRef?: React.RefObject<BottomSheetMethods>;
  };
};

export type GeneralBottomSheetNavigationProp<
  T extends keyof RootStackParamList,
> = NavigationProp<RootStackParamList, T>;

export type GeneralBottomSheetRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;
