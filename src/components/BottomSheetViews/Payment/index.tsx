import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/metrics';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView as GHScrollView} from 'react-native-gesture-handler';

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {BusinessHeader} from '@components/Business/Header';
import {dp} from '../../../utils/dp';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {Button} from '@styled/buttons';
import useStore from '../../../state/store';
import {LoadingModal} from '@styled/views/LoadingModal';
import {CustomModal} from '@styled/views/CustomModal';
import {PromocodeModal} from '@styled/views/PromocodeModal';
import PaymentMethods from '@components/PaymentMethods';
import PaymentSummary from '@components/BottomSheetViews/Payment/PaymentSummary';
import PointsToggle from '@components/BottomSheetViews/Payment/PointsToggle';
import {useBonusPoints} from '@hooks/useBonusPoints.ts';
import {usePaymentProcess} from '@hooks/usePaymentProcess.ts';
import PromocodeSection from '@components/BottomSheetViews/Payment/PromocodeSection';
import {usePromoCode} from '@hooks/usePromoCode.ts';
import {
  DiscountType,
  IPersonalPromotion,
} from '../../../types/models/PersonalPromotion.ts';
import {
  calculateActualDiscount,
  calculateActualPointsUsed,
  calculateFinalAmount,
} from '@utils/paymentHelpers.ts';

const Payment = () => {
  const {user, loadUser, isBottomSheetOpen, orderDetails, selectedPos} =
    useStore.getState();

  const isOpened = isBottomSheetOpen;
  const order = orderDetails;

  /**
   * ___________NEW CODE VERSION FOR PAYMENT COMPONENT___________
   * ____________________________________________________________
   */

  const [finalOrderCost, setFinalOrderCost] = useState<number>(order.sum);
  const [paymentErrorModalState, setPaymentErrorModalState] =
    useState<boolean>(false);

  const {
    inputCodeValue,
    discount,
    promoError,
    isMutating,
    promoCodeId,
    setPromocode,
    applyPromoCode,
    debouncedApplyPromoCode,
    resetPromoCode,
  } = usePromoCode(order.posId || 0);

  const {usedPoints, toggled, applyPoints, togglePoints} = useBonusPoints(
    user,
    order,
    discount,
  );

  const {
    loading,
    error,
    orderStatus,
    processPayment,
    clearError,
    setPaymentMethod,
    paymentMethod,
  } = usePaymentProcess(
    user,
    order,
    discount,
    usedPoints,
    promoCodeId,
    loadUser,
  );

  // Handle promo code selection from promotions slider
  const handlePromoPress = (promo: IPersonalPromotion) => {
    if (!promo) {
      return;
    }

    setPromocode(promo.code);
    applyPromoCode(promo.code);
  };

  // Handle search input change
  const handleSearchChange = (val: string) => {
    setPromocode(val);
  };

  const [showPromocodeModal, setShowPromocodeModal] = useState(false);

  useEffect(() => {
    if (error) {
      setPaymentErrorModalState(true);
    }
  }, [error]);

  // Effect to update UI when promo code is validated
  useEffect(() => {
    if (promoCodeId && showPromocodeModal) {
      setShowPromocodeModal(false);
    }
  }, [promoCodeId, showPromocodeModal]);

  useEffect(() => {
    // Calculate the actual discount amount
    const actualDiscount = calculateActualDiscount(discount, order.sum);

    // Calculate actual points used
    const actualPoints = calculateActualPointsUsed(
      order.sum,
      actualDiscount,
      usedPoints,
    );

    // Calculate the final amount
    const finalSum = calculateFinalAmount(
      order.sum,
      actualDiscount,
      actualPoints,
    );

    // Update the state
    setFinalOrderCost(finalSum);
  }, [order.sum, discount, usedPoints, toggled, user]);

  return (
    <View
      style={{
        ...styles.container,
        paddingLeft: dp(22),
        paddingRight: dp(22),
        paddingTop: dp(5),
      }}>
      <BottomSheetScrollView nestedScrollEnabled={true} scrollEnabled={true}>
        <CustomModal
          isVisible={paymentErrorModalState}
          text={error ? error : ''}
          onClick={() => {
            clearError();
            resetPromoCode();
            setPaymentErrorModalState(false);
          }}
        />
        <LoadingModal
          isVisible={!!orderStatus}
          color={'#FFFFFF'}
          status={orderStatus ? orderStatus : 'start'}
          stageText={{
            start: 'Подготавливаем оборудование...',
            processing: 'Зачисляем деньги...',
            end: 'Удачной мойки',
          }}
          modalStyle={{}}
          textStyle={{}}
        />

        {showPromocodeModal ? (
          <PromocodeModal
            onClose={() => {
              setPromocode('');
              setShowPromocodeModal(false);
            }}
            promocode={inputCodeValue ?? ''}
            handleSearchChange={handleSearchChange}
            apply={debouncedApplyPromoCode}
            promocodeError={promoError}
            fetching={isMutating}
          />
        ) : (
          <>
            <BusinessHeader type="box" box={order?.bayNumber ?? 0} />
            <Text style={styles.title}>Оплата</Text>
            <GHScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                ...styles.paymentCard,
                paddingBottom: dp(300),
              }}
              nestedScrollEnabled={true}
              scrollEnabled={isOpened}>
              <Text style={styles.section}>Ваш выбор</Text>
              <PaymentSummary
                order={order}
                user={user}
                selectedPos={selectedPos}
              />
              <View style={styles.choice}>
                {selectedPos?.IsLoyaltyMember && (
                  <PointsToggle
                    user={user}
                    order={order}
                    discount={discount}
                    usedPoints={usedPoints}
                    toggled={toggled}
                    onToggle={togglePoints}
                    applyPoints={applyPoints}
                  />
                )}

                <PromocodeSection
                  promocode={inputCodeValue}
                  onPress={() => setShowPromocodeModal(true)}
                  quickPromoSelect={handlePromoPress}
                  quickPromoDeselect={() => setPromocode(undefined)}
                />

                <GHScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {discount ? (
                    <View style={{paddingTop: dp(15)}}>
                      <Button
                        label={`У ВАС ЕСТЬ ПРОМОКОД НА ${
                          discount.type === DiscountType.CASH
                            ? discount.discount + '₽'
                            : discount.discount + '%'
                        }`}
                        onClick={() => {}}
                        color="blue"
                        width={184}
                        height={31}
                        fontSize={10}
                        fontWeight={'600'}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                  {usedPoints ? (
                    <View style={{paddingTop: dp(15)}}>
                      <Button
                        label={`ИСПОЛЬЗОВАНО ${usedPoints} БАЛОВ`}
                        onClick={() => {}}
                        color="blue"
                        width={184}
                        height={31}
                        fontSize={10}
                        fontWeight={'600'}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </GHScrollView>
              </View>
              <PaymentMethods
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Button
                  label={`Оплатить ${finalOrderCost} ₽`}
                  onClick={processPayment}
                  color="blue"
                  height={43}
                  fontSize={18}
                  fontWeight={'600'}
                  showLoading={loading}
                />
              </View>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: dp(10),
                }}
                onPress={() => {
                  navigateBottomSheet('Main', {});
                }}>
                <Text
                  style={{
                    fontSize: dp(12),
                    textDecorationLine: 'underline',
                  }}>
                  Отменить заказ
                </Text>
              </TouchableOpacity>
            </GHScrollView>
          </>
        )}
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: dp(22),
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
    color: '#000',
  },
  text: {
    fontSize: dp(16),
    fontWeight: '400',
    color: '#000',
  },
  middle: {
    flex: 1,
    paddingLeft: dp(22),
    paddingRight: dp(22),
  },
  middleText: {
    fontSize: dp(36),
    fontWeight: '600',
  },
  boxes: {
    paddingTop: dp(81),
  },
  carImage: {
    width: dp(32),
    height: dp(32),
  },
  button: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: dp(22),
  },
  paymentCard: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    borderRadius: dp(25),
    padding: dp(25),
    marginTop: dp(25),
  },
  section: {
    fontSize: dp(20),
    fontWeight: '600',
    color: '#000',
  },
  /*Cards*/
  scrollViewContent: {
    flexDirection: 'row',
    marginTop: dp(10),
  },
  card: {
    width: dp(105),
    height: dp(63),
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    // padding: 16,
    padding: dp(5),
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  cardAdd: {
    width: dp(105),
    height: dp(63),
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    // padding: 16,
    padding: dp(5),
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#888',
  },
  logo: {
    maxWidth: dp(35),
    height: dp(26),
  },
  number: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    color: '#000',
  },
  numberLabel: {
    fontWeight: '600',
    fontSize: dp(16),
    color: '#000',
  },
  addCardLabel: {
    color: 'rgba(163, 163, 166, 1)',
    fontWeight: '600',
    fontSize: dp(12),
    paddingLeft: dp(4),
  },
  choice: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    padding: 16,
  },
  promoCodeTextInput: {
    backgroundColor: 'rgba(216, 217, 221, 1)',
    borderRadius: moderateScale(25),
    alignSelf: 'stretch',
    width: horizontalScale(200),
    height: verticalScale(35),
    fontSize: moderateScale(10),
    textAlign: 'left',
    padding: 5,
    color: '#000000',
  },
});

export {Payment};
