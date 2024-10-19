import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Partner} from './api/app/types.ts';

export type DrawerParamList = {
  Главная: undefined; // No params needed for Home
  Промокоды: undefined; // No params needed for Promos
  Партнеры: undefined; // No params needed for Partners
  Настройки: undefined; // No params needed for Settings
  'О приложении': undefined; // No params needed for About
  Партнер: {data: Partner}; // Example of params needed for Partner
  'Ввод Промокода': undefined; // No params needed for PromosInput
  'Правовые документы': undefined; // No params needed for Legals
};

export type GeneralDrawerNavigationProp<T extends keyof DrawerParamList> =
  DrawerNavigationProp<DrawerParamList, T>;
