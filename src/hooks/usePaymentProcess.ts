import {IUser} from '@app-types/models/User.ts';
import {OrderDetailsType} from '../state/order/OrderSlice.ts';
import {useCallback, useState} from 'react';
import {getCredentials} from '@services/api/payment';
import {confirmPayment, tokenize} from '../native';
import {
  calculateActualPointsUsed,
  calculateFinalAmount,
  createPaymentConfig,
  calculateActualDiscount,
} from '@utils/paymentHelpers.ts';
import {create, pingPos, register} from '@services/api/order';
import {PaymentMethodTypesEnum} from '@app-types/PaymentType.ts';
import {ICreateOrderRequest} from '@app-types/api/order/req/ICreateOrderRequest.ts';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {ICreateOrderResponse} from '@app-types/api/order/res/ICreateOrderResponse.ts';
import {DiscountValueType} from '@hooks/usePromoCode.ts';
import {PaymentMethodType} from '@styled/buttons/PaymentMethodButton';
import {getOrderByOrderId} from '@services/api/order';
import {
  ORDER_ERROR_CODES,
  PAYMENT_ERROR_CODES,
  OTHER_ERROR_CODES,
} from '@app-types/api/constants/index.ts';
import {OrderProcessingStatus} from '@app-types/api/order/processing/OrderProcessingStatus.ts';
import {DdLogs} from '@datadog/mobile-react-native';

import AppMetrica from '@appmetrica/react-native-analytics';

export const usePaymentProcess = (
  user: IUser,
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
  const errorHandler = (error: any) => {
    setLoading(false);
    if (
      error.code === 'ERROR_PAYMENT_CANCELLED' ||
      error.code === 'E_PAYMENT_CANCELLED'
    ) {
      setError('Заказ отменён. Платёж не был завершён');
      DdLogs.error('Payment process error: ', {error: error.code});
    } else {
      const errorCode = error.response?.data?.code || 'Unknown error code';
      const errorMessage =
        error.response?.data?.message || 'No additional message';
      DdLogs.error('Payment process error:', {
        error: errorCode,
        message: errorMessage,
      });
      switch (error.response.data.code) {
        case ORDER_ERROR_CODES.PROCESSING_ERROR:
          setError('Ошибки обработки');
          break;
        case ORDER_ERROR_CODES.ORDER_NOT_FOUND:
          setError('Заказ не найден');
          break;
        case ORDER_ERROR_CODES.INVALID_ORDER_STATE:
          setError('Недействительное состояние заказа');
          break;
        case ORDER_ERROR_CODES.PAYMENT_CANCELED:
          setError('Платеж отменен');
          break;
        case ORDER_ERROR_CODES.PAYMENT_TIMEOUT:
          setError('');
          break;
        case ORDER_ERROR_CODES.ORDER_CREATION_FAILED:
          setError('Не удалось создать заказ');
          break;
        case ORDER_ERROR_CODES.INSUFFICIENT_REWARD_POINTS:
          setError('Недостаточно бонусных баллов');
          break;
        case ORDER_ERROR_CODES.REWARD_POINTS_WITHDRAWAL_FAILED:
          setError('Не удалось списать бонусные баллы');
          break;
        case ORDER_ERROR_CODES.CARD_FOR_ORDER_NOT_FOUND:
          setError('Карта для заказа не найдена');
          break;
        case ORDER_ERROR_CODES.INSUFFICIENT_FREE_VACUUM:
          setError('Недостаточно свободных пылесосов');
          break;
        case PAYMENT_ERROR_CODES.PROCESSING_ERROR:
          setError('Ошибка обработки платежа');
          break;
        case PAYMENT_ERROR_CODES.PAYMENT_REGISTRATION_FAILED:
          setError('Не удалось зарегистрировать платеж');
          break;
        case PAYMENT_ERROR_CODES.INVALID_WEBHOOK_SIGNATURE:
          setError('Недействительная подпись вебхука');
          break;
        case PAYMENT_ERROR_CODES.MISSING_ORDER_ID:
          setError('Отсутствует идентификатор заказа');
          break;
        case PAYMENT_ERROR_CODES.MISSING_PAYMENT_ID:
          setError('Отсутствует идентификатор платежа');
          break;
        case PAYMENT_ERROR_CODES.REFUND_FAILED:
          setError('Не удалось вернуть средства');
          break;
        case OTHER_ERROR_CODES.BAY_IS_BUSY_ERROR_CODE:
          setError('Пост занят');
          break;
        case OTHER_ERROR_CODES.CARWASH_UNAVALIBLE_ERROR_CODE:
          setError('Автомойка недоступна');
          break;
        case OTHER_ERROR_CODES.CARWASH_START_FAILED:
          setError('Ошибка запуска автомойки');
          break;
        case OTHER_ERROR_CODES.PROMO_CODE_NOT_FOUND_ERROR_CODE:
          setError('Промокод не найден');
          break;
        case OTHER_ERROR_CODES.INVALID_PROMO_CODE_ERROR_CODE:
          setError('Недействительный промокод');
          break;
        case OTHER_ERROR_CODES.SERVER_ERROR:
          setError('Ошибка сервера');
          break;
        default:
          setError('Неизвестная ошибка');
          break;
      }
    }
  };

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
      setOrderStatus(OrderProcessingStatus.PROCESSING);
      // Get payment credentials
      const paymentConfig = await getCredentials();

      const apiKey: string = paymentConfig.apiKey.toString();
      const storeId: string = paymentConfig.storeId.toString();

      const actualDiscount = calculateActualDiscount(discount, order.sum);

      const pointsSum = calculateActualPointsUsed(
        order.sum,
        actualDiscount,
        usedPoints,
      );

      const realSum = calculateFinalAmount(
        order.sum,
        actualDiscount,
        pointsSum,
      );

      // Check bay status
      const bayStatus = await pingPos({
        carWashId: order.posId,
        bayNumber: order.bayNumber,
        bayType: order.bayType,
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
        originalSum: order.sum,
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
      const orderResult: ICreateOrderResponse = await create(
        createOrderRequest,
      );

      AppMetrica.reportEvent('Create Order Success', createOrderRequest);

      // обработать ошибку создания заказа
      if (orderResult.status !== 'created') {
        setError('🙅‍К сожалению, не удалось создать заказ');
        setLoading(false);
        // setOrderStatus(null);
        return;
      }

      // Start tokenization
      const {token, paymentMethodType} = await tokenize(paymentConfigParams);

      if (!token) {
        setError('🔐 Ошибка оплаты. Попробуйте ещё раз');
        setLoading(false);
        // setOrderStatus(null);
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

      if (status !== 'waiting_payment') {
        setError('🙅‍К сожалению, оплата не прошла');
        setLoading(false);
        // setOrderStatus(null);
        return;
      }

      setOrderStatus(OrderProcessingStatus.WAITING_PAYMENT);

      await confirmPayment({
        confirmationUrl: confirmation_url,
        paymentMethodType,
        shopId: storeId,
        clientApplicationKey: apiKey,
      });

      AppMetrica.reportEvent('Payment Success', {
        confirmationUrl: confirmation_url,
        paymentMethodType,
      });

      setOrderStatus(OrderProcessingStatus.POLLING);

      // poll order status until COMPLETED
      const pollInterval = 10000;
      let attempts = 0;
      const maxAttempts = 30; // e.g. 30 attempts = ~5 minute

      const pollOrderStatus = async () => {
        try {
          const response = await getOrderByOrderId(orderResult.orderId);
          if (response.status === 'completed') {
            setOrderStatus(OrderProcessingStatus.END);
            setLoading(false);
            DdLogs.info('Successful order creation', {order});
            // При успешном окончании оплаты через 3 секунды закрываем BottomSheet и переходим на страницу PostPayment
            setTimeout(() => {
              navigateBottomSheet('PostPayment', {});
              setOrderStatus(null);
            }, 3000);
          } else if (response.status === 'failed') {
            setError('Ошибка оборудования');
            DdLogs.error('Equipment error', {order});
            setLoading(false);
          } else {
            attempts++;
            if (attempts >= maxAttempts) {
              setError('⏳ Время ожидания оплаты истекло. Попробуйте снова.');
              DdLogs.error('Payment time expired', {order});
              setLoading(false);
              // setOrderStatus(null);
            } else {
              setTimeout(pollOrderStatus, pollInterval);
            }
          }
        } catch (err: any) {
          if (err?.code === 'OrderNotFoundException') {
            setError('Заказ не найден');
          } else {
            setError('⚠️ Ошибка при проверке статуса заказа');
          }
          setLoading(false);
          // setOrderStatus(null);
        }
      };

      pollOrderStatus();
    } catch (error: any) {
      errorHandler(error);
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

  const processFreePayment = async () => {
    if (!order.posId || !order.bayNumber || order.sum === undefined || !user) {
      setError(
        '⚠️ Что-то пошло не так... Пожалуйста, попробуйте ещё раз через пару минут',
      );
      return;
    }

    try {
      setLoading(true);
      setOrderStatus(OrderProcessingStatus.PROCESSING_FREE);

      const bayStatus = await pingPos({
        carWashId: order.posId,
        bayNumber: order.bayNumber,
        bayType: order.bayType,
      });

      if (bayStatus.status !== 'Free') {
        setError(
          '🙅‍К сожалению, автомойка занята или не может принять заказ сейчас',
        );
        setLoading(false);
        return;
      }

      const orderRequest: ICreateOrderRequest = {
        sum: order.sum,
        originalSum: order.sum,
        rewardPointsUsed: 0,
        carWashId: Number(order.posId),
        bayNumber: Number(order.bayNumber),
        bayType: order.bayType,
      };

      const orderResult: ICreateOrderResponse = await create(orderRequest);

      AppMetrica.reportEvent('Create Order Success', {
        sum: order.sum,
        originalSum: order.sum,
        rewardPointsUsed: 0,
        carWashId: Number(order.posId),
        bayNumber: Number(order.bayNumber),
        bayType: order.bayType,
      });

      const pollInterval = 10000;
      let attempts = 0;
      const maxAttempts = 30;

      const pollOrderStatus = async () => {
        const response = await getOrderByOrderId(orderResult.orderId);
        if (response.status === 'completed') {
          setOrderStatus(OrderProcessingStatus.END_FREE);
          setLoading(false);
          DdLogs.info('Successful order creation (free vacuume)', {order});
          // При успешном окончании оплаты через 3 секунды закрываем BottomSheet и переходим на страницу PostPayment
          setTimeout(() => {
            navigateBottomSheet('PostPayment', {});
            setOrderStatus(null);
          }, 3000);
        } else if (response.status === 'failed') {
          setError('Ошибка оборудования');
          DdLogs.error('Equipment error', {order});
          setLoading(false);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            setError('⏳ Время ожидания истекло. Попробуйте снова.');
            DdLogs.error('Payment time expired (free vacuume)', {order});
            setLoading(false);
          } else {
            setTimeout(pollOrderStatus, pollInterval);
          }
        }
      };
      pollOrderStatus();
    } catch (error: any) {
      errorHandler(error);
    }
  };

  return {
    loading,
    error,
    setPaymentMethod: handlePaymentMethodType,
    paymentMethod,
    orderStatus,
    setOrderStatus,
    processPayment,
    processFreePayment,
    clearError,
  };
};
