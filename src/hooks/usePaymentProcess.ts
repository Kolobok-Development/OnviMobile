import {IUser} from '../types/models/User.ts';
import {OrderDetailsType} from '../state/order/OrderSlice.ts';
import {useCallback, useEffect, useState} from 'react';
import {getCredentials} from '@services/api/payment';
import {confirmPayment, tokenize} from '../native';
import {
  calculateActualPointsUsed,
  calculateFinalAmount,
  createPaymentConfig,
} from '@utils/paymentHelpers.ts';
import {create, pingPos, register} from '@services/api/order';
import {PaymentMethodTypesEnum} from '../types/PaymentType.ts';
import {ICreateOrderRequest} from '../types/api/order/req/ICreateOrderRequest.ts';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {ICreateOrderResponse} from '../types/api/order/res/ICreateOrderResponse.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';
import {PaymentMethodType} from '@styled/buttons/PaymentMethodButton';
import {getOrderByOrderId} from '@services/api/order';

enum OrderProcessingStatus {
  START = 'start',
  PROCESSING = 'processing',
  END = 'end',
  WAITING_PAYMENT = 'waiting_payment',
  POLLING = 'polling',
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

  useEffect(() => {
    console.log(error);
  }, [error]);
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
      const realSum = calculateFinalAmount(
        order.sum,
        discount?.discount ?? 0,
        usedPoints,
      );
      const pointsSum = calculateActualPointsUsed(
        order.sum,
        discount ? discount.discount : 0,
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

      // Create order request
      const createOrderRequest: ICreateOrderRequest = {
        sum: realSum,
        rewardPointsUsed: pointsSum,
        carWashId: Number(order.posId),
        bayNumber: Number(order.bayNumber),
        bayType: order.bayType,
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

      // обработать ошибку создания заказа
      if (orderResult.status !== 'created') {
        setError('🙅‍К сожалению, не удалось создать заказ');
        setLoading(false);
        setOrderStatus(null);
        return;
      }

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

      const {status, confirmation_url} = await register({
        orderId: orderResult.orderId,
        paymentToken: token,
        amount: realSum.toString(),
        description: paymentConfigParams.subtitle,
        receiptReturnPhoneNumber: user.phone ?? '',
        transactionId: '', // откуда взять?
      });

      if (status !== 'WAITING_PAYMENT') {
        setError('🙅‍К сожалению, оплата не прошла');
        setLoading(false);
        setOrderStatus(null);
        return;
      }

      setOrderStatus(OrderProcessingStatus.WAITING_PAYMENT);

      await confirmPayment({
        confirmationUrl: confirmation_url,
        paymentMethodType,
        shopId: storeId,
        clientApplicationKey: apiKey,
      });
      setOrderStatus(OrderProcessingStatus.POLLING);

      // poll order status until COMPLETED
      const pollInterval = 10000;
      let attempts = 0;
      const maxAttempts = 30; // e.g. 30 attempts = ~5 minute

      const pollOrderStatus = async () => {
        try {
          const response = await getOrderByOrderId(orderResult.orderId);

          if (response.status === 'COMPLETED') {
            setOrderStatus(OrderProcessingStatus.END);
            setLoading(false);
            navigateBottomSheet('PostPayment', {});
          } else {
            attempts++;
            if (attempts >= maxAttempts) {
              setError('⏳ Время ожидания оплаты истекло. Попробуйте снова.');
              setLoading(false);
              setOrderStatus(null);
            } else {
              setTimeout(pollOrderStatus, pollInterval);
            }
          }
        } catch (err: any) {
          console.error('Polling error:', err);
          if (err?.code === 'OrderNotFoundException') {
            setError('❌ Заказ не найден');
          } else {
            setError('⚠️ Ошибка при проверке статуса заказа');
          }
          setLoading(false);
          setOrderStatus(null);
        }
      };

      pollOrderStatus();
    } catch (error: any) {
      console.error('Payment process error:', error);
      setOrderStatus(null);
      setLoading(false);
      if (
        error.code === 'ERROR_PAYMENT_CANCELLED' ||
        error.code === 'E_PAYMENT_CANCELLED'
      ) {
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

  const processFreePayment = () => {
    console.log("Зашли в processFreePayment");
    // здесь деллаем запрос на бек с бесплатной активацией пылесоса и возвращаем результат
  };

  return {
    loading,
    error,
    setPaymentMethod: handlePaymentMethodType,
    paymentMethod,
    orderStatus,
    processPayment,
    processFreePayment,
    clearError,
  };
};
