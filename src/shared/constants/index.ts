import { DraggableScreensMap } from "../../types/navigation/BottomSheetScreenName.ts";

export const SCREENS = {
  HOME: 'Home',
  SEARCH: 'Search',
  NOTIFICATION: 'Notification',
  PROFILE: 'Profile',
  DETAIL: 'Detail',
};

export const API = {
  clientApiBaseUrl: 'https://api.onvione.ru/api/v2',
  appDataApiBaseUrl: 'https://onvi-mobile-app-api-kqeql.ondigitalocean.app',
};



export const DRAGGABLE_SCREENS: DraggableScreensMap = {
  'Main': true,
  'Search': true,
  'Filters': true,
  'BusinessInfo': false,
  'Boxes': false,
  'Launch': false,
  'Notifications': true,
  'History': true,
  'Payment': false,
  'AddCard': false,
  'Post': true,
  'Campaign': true,
  'PostPayment': false,
};
