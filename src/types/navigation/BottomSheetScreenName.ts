export type ScreenName =
  | 'Main'
  | 'Search'
  | 'Filters'
  | 'BusinessInfo'
  | 'Boxes'
  | 'Launch'
  | 'Notifications'
  | 'History'
  | 'Payment'
  | 'AddCard'
  | 'Post'
  | 'Campaign'
  | 'PostPayment';

export type DraggableScreensMap = {
  [key in ScreenName]: boolean;
};
