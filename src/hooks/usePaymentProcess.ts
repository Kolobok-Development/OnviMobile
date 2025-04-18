import {IUser} from '../types/models/User.ts';
import {OrderDetailsType} from '../state/order/OrderSlice.ts';
import {useCallback, useState} from 'react';
import {createPayment, getCredentials} from '@services/api/payment';
import {confirmPayment, dismiss, tokenize} from '../native';
import {
  calculateActualPointsUsed,
  calculateFinalAmount,
  createPaymentConfig,
} from '@utils/paymentHelpers.ts';
import {create, pingPos} from '@services/api/order';
import {PaymentMethodTypesEnum} from '../types/PaymentType.ts';
import {ICreateOrderRequest} from '../types/api/order/req/ICreateOrderRequest.ts';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {getPaymentErrorMessage} from '@utils/errorHandlers.ts';
import {ICreateOrderResponse} from '../types/api/order/res/ICreateOrderResponse.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';
import {PaymentMethodType} from '@styled/buttons/PaymentMethodButton';

enum OrderProcessingStatus {
  START = 'start',
  PROCESSING = 'processing',
  END = 'end',
}

export const usePaymentProcess = (
  user: IUser | null,
  order: OrderDetailsType,
  discount: DiscountValueType | null,
  usedPoints: number,
  promoCodeId?: number,
  loadUser?: () => Promise<void>,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderProcessingStatus | null>(
    null,
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodType>('BANK_CARD');

  /**
   * Process payment and create order
   */
  const processPayment = useCallback(async () => {
    //Validation process
    if (!user) {
      setError(
        '⚠️ Что-то пошло не так... Пожалуйста, попробуйте ещё раз через пару минут',
      );
      return;
    }

    if (!order.posId || !order.bayNumber || order.sum === undefined) {
      setError(
        '⚠️ Что-то пошло не так... Пожалуйста, попробуйте ещё раз через пару минут',
      );
      return;
    }

    if (paymentMethod === undefined || paymentMethod === null) {
      setError('💳 Выберите способ оплаты, чтобы продолжить');
      return;
    }

    //Order creation process

    try {
      setLoading(true);

      // Get payment credentials
      const paymentConfig = await getCredentials();
      const apiKey: string = paymentConfig.apiKey.toString();
      const storeId: string = paymentConfig.storeId.toString();

      // Calculate payment amounts
      const realSum = calculateFinalAmount(order.sum, discount, usedPoints);
      const pointsSum = calculateActualPointsUsed(
        order.sum,
        discount,
        usedPoints,
      );

      // Check bay status
      const bayStatus = await pingPos({
        carWashId: order.posId,
        bayNumber: order.bayNumber,
      });

      if (bayStatus.status !== 'Free') {
        setError(
          '🙅‍К сожалению, автомойка занята или не может принять заказ сейчас',
        );
        setLoading(false);
        return;
      }

      //Adding payment method

      let paymentMethodTypes = [];

      switch (paymentMethod) {
        case PaymentMethodTypesEnum.BANK_CARD:
          paymentMethodTypes.push(PaymentMethodTypesEnum.BANK_CARD);
          break;
        case PaymentMethodTypesEnum.SBERBANK:
          paymentMethodTypes.push(PaymentMethodTypesEnum.SBERBANK);
          break;
        case PaymentMethodTypesEnum.SBP:
          paymentMethodTypes.push(PaymentMethodTypesEnum.SBP);
          break;
        default:
          break;
      }

      // Create payment config
      const paymentConfigParams = createPaymentConfig(
        apiKey,
        storeId,
        order,
        realSum,
        user,
        paymentMethodTypes,
      );

      // Start tokenization
      console.log('🐛STARTING TOKENIZTION');
      console.log(JSON.stringify(paymentConfigParams));
      const {token, paymentMethodType} = await tokenize(paymentConfigParams);
      console.log('🐛TOKENIZATION SUCCESS');
      console.log(JSON.stringify(token));
      console.log(JSON.stringify(paymentMethodTypes));

      if (!token) {
        setError('🔐 Ошибка оплаты. Попробуйте ещё раз');
        setLoading(false);
        setOrderStatus(null);
        return;
      }

      // Create payment
      console.log('🐛CREATING PAYMENT ON BACKEND');
      const payment = await createPayment({
        paymentToken: token,
        amount: realSum.toString(),
        description: paymentConfigParams.subtitle,
      });

      console.log('🐛BACKEND RESPONSE');
      console.log(JSON.stringify(payment, null, 2));

      // Check for payment errors
      const errorMessage = getPaymentErrorMessage(payment);

      if (errorMessage) {
        setError(errorMessage);
        setLoading(false);
        setOrderStatus(null);
        await dismiss();
        return;
      }

      // Confirm payment
      const confirmationUrl = payment.confirmation?.confirmation_url;
      const paymentId = payment.id;

      if (!confirmationUrl || !paymentId) {
        setError(
          '❌ Не удалось подтвердить платёж. Проверьте данные и попробуйте снова',
        );
        setLoading(false);
        setOrderStatus(null);
        return;
      }

      console.log('🐛STARTING CONFIRMATION');
      console.log(
        JSON.stringify(
          {
            confirmationUrl,
            paymentMethodType: paymentMethodType.toUpperCase(),
            shopId: storeId,
            clientApplicationKey: apiKey,
          },
          null,
          2,
        ),
      );
      await confirmPayment({
        confirmationUrl,
        paymentMethodType,
        shopId: storeId,
        clientApplicationKey: apiKey,
      });

      setOrderStatus(OrderProcessingStatus.START);

      // Create order request
      const createOrderRequest: ICreateOrderRequest = {
        transactionId: paymentId,
        sum: realSum,
        rewardPointsUsed: pointsSum,
        carWashId: Number(order.posId),
        bayNumber: Number(order.bayNumber),
      };

      // Add promo code if available
      if (promoCodeId && discount && discount?.discount > 0) {
        createOrderRequest.sum = realSum;
        createOrderRequest.promoCodeId = promoCodeId;
      }

      // Create order
      setOrderStatus(OrderProcessingStatus.PROCESSING);
      const orderResult: ICreateOrderResponse = await create(
        createOrderRequest,
      );

      if (orderResult.sendStatus === 'Success') {
        if (loadUser) {
          await loadUser();
        }
        setOrderStatus(OrderProcessingStatus.END);
      }

      // Navigate to post-payment screen after delay
      setTimeout(() => {
        setOrderStatus(null);
        setLoading(false);
        navigateBottomSheet('PostPayment', {});
      }, 5000);
    } catch (error: any) {
      console.error('Payment process error:', error);
      setOrderStatus(null);
      setLoading(false);
      if (error.code === 'ERROR_PAYMENT_CANCELLED') {
        setError('❌ Заказ отменён. Платёж не был завершён');
      }
    }
  }, [user, order, discount, usedPoints, promoCodeId, loadUser, paymentMethod]);

  const handlePaymentMethodType = useCallback((value: PaymentMethodType) => {
    setPaymentMethod(value);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    setPaymentMethod: handlePaymentMethodType,
    paymentMethod,
    orderStatus,
    processPayment,
    clearError,
  };
};
