import { IUser } from '../types/models/User.ts';
import { OrderDetailsType } from '../state/order/OrderSlice.ts';
import { useCallback, useEffect, useState } from 'react';
import { getCredentials } from '@services/api/payment';
import { confirmPayment, tokenize } from '../native';
import {
  calculateActualPointsUsed,
  calculateFinalAmount,
  createPaymentConfig,
  calculateActualDiscount,
} from '@utils/paymentHelpers.ts';
import { create, pingPos, register } from '@services/api/order';
import { PaymentMethodTypesEnum } from '../types/PaymentType.ts';
import { ICreateOrderRequest } from '../types/api/order/req/ICreateOrderRequest.ts';
import { navigateBottomSheet } from '@navigators/BottomSheetStack';

import { ICreateOrderResponse } from '../types/api/order/res/ICreateOrderResponse.ts';
import { DiscountValueType } from '@hooks/usePromoCode.ts';
import { PaymentMethodType } from '@styled/buttons/PaymentMethodButton';
import { getOrderByOrderId } from '@services/api/order';
import { ORDER_ERROR_CODES, PAYMENT_ERROR_CODES, OTHER_ERROR_CODES } from '../types/api/constants/index.ts';
import { OrderProcessingStatus } from '../types/api/order/processing/OrderProcessingStatus.ts';
import { DdLogs } from '@datadog/mobile-react-native';

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
  const errorHandler = (error: any) => {
    setLoading(false);
    if (
      error.code === 'ERROR_PAYMENT_CANCELLED' ||
      error.code === 'E_PAYMENT_CANCELLED'
    ) {
      setError('Заказ отменён. Платёж не был завершён');
      DdLogs.error("Payment process error: ", { error: error.code});
    } else {
      const errorCode = error.response?.data?.code || 'Unknown error code';
      const errorMessage = error.response?.data?.message || 'No additional message';
      DdLogs.error("Payment process error:", { error: errorCode, message: errorMessage });
      switch (error.response.data.code) {
        case ORDER_ERROR_CODES.PROCESSING_ERROR:
          console.error("Processing Error:", error.response.data.message);
          setError('Ошибки обработки');
          break;
        case ORDER_ERROR_CODES.ORDER_NOT_FOUND:
          console.error("Order Not Found:", error.response.data.message);
          setError('Заказ не найден');
          break;
        case ORDER_ERROR_CODES.INVALID_ORDER_STATE:
          console.error("Invalid Order State:", error.response.data.message);
          setError('Недействительное состояние заказа');
          break;
        case ORDER_ERROR_CODES.PAYMENT_CANCELED:
          console.error("Payment Canceled:", error.response.data.message);
          setError('Платеж отменен');
          break;
        case ORDER_ERROR_CODES.PAYMENT_TIMEOUT:
          console.error("Payment Timeout:", error.response.data.message);
          setError('');
          break;
        case ORDER_ERROR_CODES.ORDER_CREATION_FAILED:
          console.error("Order Creation Failed:", error.response.data.message);
          setError('Не удалось создать заказ');
          break;
        case ORDER_ERROR_CODES.INSUFFICIENT_REWARD_POINTS:
          console.error("Insufficient Reward Points:", error.response.data.message);
          setError('Недостаточно бонусных баллов');
          break;
        case ORDER_ERROR_CODES.REWARD_POINTS_WITHDRAWAL_FAILED:
          console.error("Reward Points Withdrawal Failed:", error.response.data.message);
          setError('Не удалось списать бонусные баллы');
          break;
        case ORDER_ERROR_CODES.CARD_FOR_ORDER_NOT_FOUND:
          console.error("Card for Order Not Found:", error.response.data.message);
          setError('Карта для заказа не найдена');
          break;
        case ORDER_ERROR_CODES.INSUFFICIENT_FREE_VACUUM:
          console.error("Insufficient Free Vacuum:", error.response.data.message);
          setError('Недостаточно свободных пылесосов');
          break;
        case PAYMENT_ERROR_CODES.PROCESSING_ERROR:
          console.error("Payment Processing Error:", error.response.data.message);
          setError('Ошибка обработки платежа');
          break;
        case PAYMENT_ERROR_CODES.PAYMENT_REGISTRATION_FAILED:
          console.error("Payment Registration Failed:", error.response.data.message);
          setError('Не удалось зарегистрировать платеж');
          break;
        case PAYMENT_ERROR_CODES.INVALID_WEBHOOK_SIGNATURE:
          console.error("Invalid Webhook Signature:", error.response.data.message);
          setError('Недействительная подпись вебхука');
          break;
        case PAYMENT_ERROR_CODES.MISSING_ORDER_ID:
          console.error("Missing Order ID:", error.response.data.message);
          setError('Отсутствует идентификатор заказа');
          break;
        case PAYMENT_ERROR_CODES.MISSING_PAYMENT_ID:
          console.error("Missing Payment ID:", error.response.data.message);
          setError('Отсутствует идентификатор платежа');
          break;
        case PAYMENT_ERROR_CODES.REFUND_FAILED:
          console.error("Refund Failed:", error.response.data.message);
          setError('Не удалось вернуть средства');
          break;
        case OTHER_ERROR_CODES.BAY_IS_BUSY_ERROR_CODE:
          console.error("Bay Is Busy:", error.response.data.message);
          setError('Пост занят');
          break;
        case OTHER_ERROR_CODES.CARWASH_UNAVALIBLE_ERROR_CODE:
          console.error("Carwash Unavalible:", error.response.data.message);
          setError('Автомойка недоступна');
          break;
        case OTHER_ERROR_CODES.CARWASH_START_FAILED:
          console.error("Carwash Start Failed:", error.response.data.message);
          setError('Ошибка запуска автомойки');
          break;
        case OTHER_ERROR_CODES.PROMO_CODE_NOT_FOUND_ERROR_CODE:
          console.error("Promocode Not Found:", error.response.data.message);
          setError('Промокод не найден');
          break;
        case OTHER_ERROR_CODES.INVALID_PROMO_CODE_ERROR_CODE:
          console.error("Invalid Promo Code:", error.response.data.message);
          setError('Недействительный промокод');
          break;
        case OTHER_ERROR_CODES.SERVER_ERROR:
          console.error("Server Error", error.response.data.message);
          setError('Ошибка сервера');
          break;
        default:
          console.error("Unknown Error:", error.response.data.message);
          setError('Неизвестная ошибка');
          break;
      }
    }
  }

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

      console.log("🌟🌟🌟 getCredentials: ", paymentConfig);

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

      console.log("🌟🌟🌟 pingPos: ", bayStatus);

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

      console.log("🌟🌟🌟 create: ", orderResult);

      // обработать ошибку создания заказа
      if (orderResult.status !== 'created') {
        setError('🙅‍К сожалению, не удалось создать заказ');
        setLoading(false);
        // setOrderStatus(null);
        return;
      }

      // Start tokenization
      console.log('🐛STARTING TOKENIZTION');
      console.log(JSON.stringify(paymentConfigParams));
      const { token, paymentMethodType } = await tokenize(paymentConfigParams);
      console.log("🌟🌟🌟 tokenize: ", paymentMethodType);

      console.log('🐛TOKENIZATION SUCCESS');
      console.log(JSON.stringify(token));
      console.log(JSON.stringify(paymentMethodTypes));

      if (!token) {
        setError('🔐 Ошибка оплаты. Попробуйте ещё раз');
        setLoading(false);
        // setOrderStatus(null);
        return;
      }

      const { status, confirmation_url } = await register({
        orderId: orderResult.orderId,
        paymentToken: token,
        amount: realSum.toString(),
        description: paymentConfigParams.subtitle,
        receiptReturnPhoneNumber: user.phone ?? '',
        transactionId: '', // откуда взять?
      });

      console.log("🌟🌟🌟 register: ", status);


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

      console.log("🌟🌟🌟 confirmPayment: ", status);

      setOrderStatus(OrderProcessingStatus.POLLING);

      // poll order status until COMPLETED
      const pollInterval = 10000;
      let attempts = 0;
      const maxAttempts = 30; // e.g. 30 attempts = ~5 minute

      const pollOrderStatus = async () => {
        try {
          const response = await getOrderByOrderId(orderResult.orderId);
          console.log("🌟🌟🌟 getOrderByOrderId: ", response);
          if (response.status === 'completed') {
            setOrderStatus(OrderProcessingStatus.END);
            setLoading(false);
            DdLogs.info("Successful order creation", { order });
            // При успешном окончании оплаты через 3 секунды закрываем BottomSheet и переходим на страницу PostPayment
            setTimeout(() => {
              navigateBottomSheet('PostPayment', {});
              setOrderStatus(null);
            }, 3000)
          } else if (response.status === 'failed') {
            setError('Ошибка оборудования');
            DdLogs.error("Equipment error", { order });
            setLoading(false);
          } else {
            attempts++;
            if (attempts >= maxAttempts) {
              setError('⏳ Время ожидания оплаты истекло. Попробуйте снова.');
              DdLogs.error("Payment time expired", { order });
              setLoading(false);
              // setOrderStatus(null);
            } else {
              setTimeout(pollOrderStatus, pollInterval);
            }
          }
        } catch (err: any) {
          console.error('Polling error:', err);
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

      console.log("🌟🌟🌟 pingPos: ", bayStatus);

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
      }

      console.log(orderRequest);

      const orderResult: ICreateOrderResponse = await create(
        orderRequest,
      );
      console.log("🌟🌟🌟 create: ", orderResult);

      const pollInterval = 10000;
      let attempts = 0;
      const maxAttempts = 30;

      const pollOrderStatus = async () => {
        const response = await getOrderByOrderId(orderResult.orderId);
        console.log("🌟🌟🌟 getOrderByOrderId: ", response);
        if (response.status === 'completed') {
          setOrderStatus(OrderProcessingStatus.END_FREE);
          setLoading(false);
          DdLogs.info("Successful order creation (free vacuume)", { order });
          // При успешном окончании оплаты через 3 секунды закрываем BottomSheet и переходим на страницу PostPayment
          setTimeout(() => {
            navigateBottomSheet('PostPayment', {});
            setOrderStatus(null);
          }, 3000)
        } else if (response.status === 'failed') {
          setError('Ошибка оборудования');
          DdLogs.error("Equipment error", { order });
          setLoading(false);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            setError('⏳ Время ожидания истекло. Попробуйте снова.');
            DdLogs.error("Payment time expired (free vacuume)", { order });
            setLoading(false);
          } else {
            setTimeout(pollOrderStatus, pollInterval);
          }
        }
      }
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
