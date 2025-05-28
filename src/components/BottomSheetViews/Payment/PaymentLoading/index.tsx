import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { Button } from '@styled/buttons';
import { dp } from '@utils/dp.ts';

enum OrderProcessingStatus {
  START = 'start',
  PROCESSING = 'processing',
  END = 'end',
  WAITING_PAYMENT = 'waiting_payment',
  POLLING = 'polling',
}

enum orderStatusText {
  start = 'Подготавливаем оборудование...',
  processing = 'Зачисляем деньги...',
  end = 'Оплата прошла успешно!',
  waiting_payment = 'Ожидаем оплату',
  polling = 'Ещё чуть-чуть...',
  processing_free = 'Активируем оборудование...',
  end_free = 'Активация прошла успешно!'
}

interface IPaymentLoading {
  orderStatus: OrderProcessingStatus | null;
  error: string | null;
  loading: boolean;
  onClick: () => void;
}

const PaymentLoading: React.FC<IPaymentLoading> = ({ orderStatus, error, loading, onClick }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);

  useEffect(() => {
    console.log(orderStatus);
  }, [orderStatus]);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
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
                style={{
                  width: dp(120),
                  height: dp(120),
                  objectFit: 'cover',
                }}
              />
            )}
            {error && (
              <Image
                source={require('./icons8-cancel-240.png')}
                style={{
                  width: dp(120),
                  height: dp(120),
                  objectFit: 'cover',
                }}
              />
            )}
            <Text style={{ marginBottom: dp(20) }}>{!error && orderStatus ? orderStatusText[orderStatus] : error}</Text>
            {error &&
              <Button
                onClick={onClick}
                label={'Повторить'}
                color="blue"
                width={129}
                height={42}
                fontSize={18}
                fontWeight="600"
              />
            }

          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0,
  },
  bottomSheetBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
  },
  handleIndicator: {
    display: 'none',
  },
  contentContainer: {
    flex: 1,
    padding: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: dp(200),
    height: dp(200),
  },
});

export default PaymentLoading;
