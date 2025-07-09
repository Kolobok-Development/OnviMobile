import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import LottieView from 'lottie-react-native';
import {Button} from '@styled/buttons';
import {dp} from '@utils/dp.ts';
import {OrderProcessingStatus} from '@app-types/api/order/processing/OrderProcessingStatus';
import {
  GeneralBottomSheetRouteProp,
  GeneralBottomSheetNavigationProp,
} from '@app-types/navigation/BottomSheetNavigation.ts';
import {useRoute, useNavigation} from '@react-navigation/native';
import {usePaymentProcess} from '@hooks/usePaymentProcess.ts';

enum OrderStatusText {
  start = 'Подготавливаем оборудование...',
  processing = 'Зачисляем деньги...',
  end = 'Оплата прошла успешно!',
  waiting_payment = 'Ожидаем оплату',
  polling = 'Ещё чуть-чуть...',
  processing_free = 'Активируем оборудование...',
  end_free = 'Активация прошла успешно!',
}

const PaymentLoading = () => {
  const route = useRoute<GeneralBottomSheetRouteProp<'PaymentLoading'>>();
  const navigation = useNavigation<GeneralBottomSheetNavigationProp<'Post'>>();

  const {user, order, discount, usedPoints, promoCodeId, loadUser, freeOn} =
    route.params;

  const {loading, error, orderStatus, processPayment, processFreePayment} =
    usePaymentProcess(
      user!, // TODO: FIX THIS
      order!, // TODO: FIX THIS
      discount,
      usedPoints,
      promoCodeId,
      loadUser,
    );

  useEffect(() => {
    if (freeOn) {
      processFreePayment();
    } else {
      processPayment();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <View style={styles.content}>
          {loading && (
            <LottieView
              source={require('./9gN0nDjDkx.json')}
              autoPlay={true}
              loop={true}
              style={styles.animation}
            />
          )}
          {orderStatus === OrderProcessingStatus.END && (
            <Image
              source={require('./icons8-check-mark-240.png')}
              style={styles.image}
            />
          )}
          {error && (
            <Image
              source={require('./icons8-cancel-240.png')}
              style={styles.image}
            />
          )}
          <Text style={styles.text}>
            {!error && orderStatus ? OrderStatusText[orderStatus] : error}
          </Text>
          {error && (
            <Button
              onClick={navigation.goBack}
              label={'Повторить'}
              color="blue"
              width={129}
              height={42}
              fontSize={18}
              fontWeight="600"
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: dp(20),
  },
  animation: {
    width: dp(200),
    height: dp(200),
  },
  image: {
    width: dp(120),
    height: dp(120),
    resizeMode: 'cover',
  },
  text: {
    marginBottom: dp(20),
    textAlign: 'center',
  },
});

export {PaymentLoading};
