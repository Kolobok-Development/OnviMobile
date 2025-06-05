import {NavigationProp, RouteProp} from '@react-navigation/native';

import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Campaign, NewsPost, Price, Tag} from '../api/app/types.ts';
import { IUser } from '../models/User.ts';
import { DiscountType } from '../models/PersonalPromotion.ts';
import { OrderDetailsType } from 'src/state/order/OrderSlice.ts';

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
    token?: string;
  };
  About: {};
  PaymentLoading: {
    user: IUser | null;
    order: OrderDetailsType | null;
    discount: DiscountType | null;
    usedPoints: number;
    promoCodeId: number;
    loadUser?: () => Promise<void>;
    freeOn: boolean;
  };
};

export type GeneralBottomSheetNavigationProp<
  T extends keyof RootStackParamList,
> = NavigationProp<RootStackParamList, T>;

export type GeneralBottomSheetRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;
