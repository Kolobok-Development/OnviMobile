import {DraggableScreensMap} from '../../types/navigation/BottomSheetScreenName.ts';

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
  Main: true,
  Search: true,
  Filters: true,
  Boxes: false,
  BusinessInfo: false,
  Launch: false,
  Notifications: true,
  History: true,
  Payment: false,
  AddCard: false,
  Post: false,
  Campaign: true,
  PostPayment: false,
};

/**
 * Bottom sheet snap point indices for different screens
 * These constants map to the positions in the bottomSheetSnapPoints array
 */
export const SNAP_POINTS = {
  COLLAPSED: 0, // 35%
  HALF_EXPANDED: 1, // 50%
  EXPANDED: 2, // maxHeightPercent%
};

/**
 * Map of screen names to their preferred snap point index
 * Use this to control which snap point a screen should use by default
 */
export const SCREEN_SNAP_POINTS = {
  Main: SNAP_POINTS.COLLAPSED,
  Business: SNAP_POINTS.HALF_EXPANDED,
  BusinessInfo: SNAP_POINTS.HALF_EXPANDED,
  Boxes: SNAP_POINTS.EXPANDED,
  Launch: SNAP_POINTS.EXPANDED,
  Payment: SNAP_POINTS.EXPANDED,
  AddCard: SNAP_POINTS.EXPANDED,
  PostPayment: SNAP_POINTS.EXPANDED,
  // For other screens, default to HALF_EXPANDED
};

export const SAFETY_ORDER_COEFICIENT_AMOUNT = 1;
