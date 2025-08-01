export const ORDER_ERROR_CODES = {
  PROCESSING_ERROR: 995,
  ORDER_NOT_FOUND: 1000,
  INVALID_ORDER_STATE: 1001,
  PAYMENT_CANCELED: 1002,
  PAYMENT_TIMEOUT: 1003,
  ORDER_CREATION_FAILED: 1004,
  INSUFFICIENT_REWARD_POINTS: 1005,
  REWARD_POINTS_WITHDRAWAL_FAILED: 1006,
  CARD_FOR_ORDER_NOT_FOUND: 1007,
  INSUFFICIENT_FREE_VACUUM: 1008,
};

export const PAYMENT_ERROR_CODES = {
  PROCESSING_ERROR: 1199,
  PAYMENT_REGISTRATION_FAILED: 1200,
  INVALID_WEBHOOK_SIGNATURE: 1201,
  MISSING_ORDER_ID: 1202,
  MISSING_PAYMENT_ID: 1203,
  REFUND_FAILED: 1204,
};

export const OTHER_ERROR_CODES = {
  BAY_IS_BUSY_ERROR_CODE: 81,
  CARWASH_UNAVALIBLE_ERROR_CODE: 89,
  CARWASH_START_FAILED: 1100,
  PROMO_CODE_NOT_FOUND_ERROR_CODE: 84,
  INVALID_PROMO_CODE_ERROR_CODE: 88,
  SERVER_ERROR: 574,
};
