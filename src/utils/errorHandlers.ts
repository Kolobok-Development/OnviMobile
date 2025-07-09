/**
 * Analyzes payment response and returns appropriate error message
 * @param {PaymentResponse} paymentResponse - Response from payment gateway
 * @returns {string|null} Error message or null if no error
 */
export const getPaymentErrorMessage = (paymentResponse: any): string | null => {
  // If payment is canceled
  if (paymentResponse?.status === 'canceled') {
    // Check cancellation details
    if (
      paymentResponse?.cancellation_details?.reason === 'insufficient_funds'
    ) {
      return 'Недостаточно средств на карте. Пожалуйста, используйте другую карту или способ оплаты.';
    }

    // Generic cancellation message
    return 'Оплата отменена. Пожалуйста, попробуйте снова или выберите другой способ оплаты.';
  }

  // Check if we need to redirect to 3DS
  if (
    paymentResponse?.confirmation?.type === 'redirect' &&
    paymentResponse?.confirmation?.confirmation_url
  ) {
    // This is not an error, but a successful redirect to 3DS
    return null;
  }

  // Check if SBP
  if (
    paymentResponse?.confirmation?.type === 'mobile_application' &&
    paymentResponse?.confirmation?.confirmation_url
  ) {
    return null;
  }

  // Generic error - if we got here but paid is false
  // if (
  //   paymentResponse?.paid === false &&
  //   !paymentResponse?.confirmation?.confirmation_url
  // ) {
  //   return 'Произошла ошибка при обработке платежа. Пожалуйста, попробуйте позже.';
  // }

  return null;
};

/**
 * Handles API errors and returns appropriate error message
 * @param {unknown} error - Error from API call
 * @returns {string} Error message
 */
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const errorResponse = (error as any).response?.data;

    if (errorResponse?.code) {
      switch (parseInt(errorResponse.code)) {
        case 8:
          return 'Промокод недействителен. Пожалуйста, проверьте и попробуйте снова.';
        default:
          return 'Произошла ошибка, повторите попытку чуть позже.';
      }
    }
  }

  return 'Произошла ошибка, повторите попытку чуть позже.';
};

export const handlePromoCodeError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const errorResponse = (error as any).response?.data;

    if (errorResponse?.code) {
      switch (parseInt(errorResponse.code)) {
        case 8:
          return 'Промокод недействителен. Пожалуйста, проверьте и попробуйте снова.';
        default:
          return 'Произошла ошибка, повторите попытку чуть позже.';
      }
    }
  }

  return 'Произошла ошибка, повторите попытку чуть позже.';
};
