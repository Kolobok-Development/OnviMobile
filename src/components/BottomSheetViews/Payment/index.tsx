import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { BusinessHeader } from '@components/Business/Header';
import { dp } from '../../../utils/dp';
import { navigateBottomSheet } from '@navigators/BottomSheetStack';
import { Button } from '@styled/buttons';
import useStore from '../../../state/store';
import { LoadingModal } from '@styled/views/LoadingModal';
import { CustomModal } from '@styled/views/CustomModal';
import { PromocodeModal } from '@styled/views/PromocodeModal';
import PaymentMethods from '@components/PaymentMethods';
import PaymentSummary from '@components/BottomSheetViews/Payment/PaymentSummary';
import PointsToggle from '@components/BottomSheetViews/Payment/PointsToggle';
import { useBonusPoints } from '@hooks/useBonusPoints.ts';
import { usePaymentProcess } from '@hooks/usePaymentProcess.ts';
import PromocodeSection from '@components/BottomSheetViews/Payment/PromocodeSection';
import { usePromoCode } from '@hooks/usePromoCode.ts';
import {
  DiscountType,
  IPersonalPromotion,
} from '../../../types/models/PersonalPromotion.ts';
import {
  calculateActualDiscount,
  calculateActualPointsUsed,
  calculateFinalAmount,
} from '@utils/paymentHelpers.ts';

import { ScrollView as GHScrollView } from 'react-native-gesture-handler';

const Payment = () => {
  const { user, loadUser, orderDetails, selectedPos } = useStore.getState();
  const freeOn = orderDetails.free

  const order = orderDetails;

  /**
   * ___________NEW CODE VERSION FOR PAYMENT COMPONENT___________
   * ____________________________________________________________
   */

  const [finalOrderCost, setFinalOrderCost] = useState<number>(order.sum);

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

  const { usedPoints, toggled, applyPoints, togglePoints } = useBonusPoints(
    user,
    order,
    discount,
  );

  const {
    loading,
    error,
    orderStatus,
    setOrderStatus,
    processPayment,
    processFreePayment,
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
    <BottomSheetView style={styles.mainContainer}>
      <GHScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollContent}>
        <BusinessHeader type="box" box={order?.bayNumber ?? 0} />
        <Text style={styles.title}>
          {freeOn ? "Активация пылесоса" : "Оплата"}
        </Text>

        <View style={styles.paymentCard}>
          <Text style={styles.section}>Ваш выбор</Text>

          <PaymentSummary
            order={order}
            user={user}
            selectedPos={selectedPos}
            finalOrderCost={finalOrderCost}
          />

          <View style={styles.choice}>
            {!freeOn && (
              <>
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
              </>
            )}


            <View style={styles.badgesContainer}>
              {discount ? (
                <View style={styles.badgeWrapper}>
                  <Button
                    label={`У ВАС ЕСТЬ ПРОМОКОД НА ${discount.type === DiscountType.CASH
                      ? discount.discount + '₽'
                      : discount.discount + '%'
                      }`}
                    onClick={() => { }}
                    color="blue"
                    width={184}
                    height={31}
                    fontSize={10}
                    fontWeight={'600'}
                  />
                </View>
              ) : null}

              {usedPoints ? (
                <View style={styles.badgeWrapper}>
                  <Button
                    label={`ИСПОЛЬЗОВАНО ${usedPoints} БАЛОВ`}
                    onClick={() => { }}
                    color="blue"
                    width={184}
                    height={31}
                    fontSize={10}
                    fontWeight={'600'}
                  />
                </View>
              ) : null}
            </View>
          </View>
          {!freeOn && (
            <PaymentMethods
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />
          )}
          <View style={styles.paymentActions}>
            {freeOn ? (
              <Button
                label="Активировать"
                onClick={() => {
                  navigateBottomSheet('PaymentLoading', {
                    user,
                    order,
                    discount,
                    usedPoints,
                    promoCodeId,
                    loadUser,
                    freeOn
                  });
                }}
                color="blue"
                height={43}
                fontSize={18}
                fontWeight={'600'}
                showLoading={loading}
              />
            ) : (
              <Button
                label={`Оплатить ${finalOrderCost} ₽`}
                onClick={() => {
                  navigateBottomSheet('PaymentLoading', {
                    user,
                    order,
                    discount,
                    usedPoints,
                    promoCodeId,
                    loadUser,
                    freeOn
                  });
                }}
                color="blue"
                height={43}
                fontSize={18}
                fontWeight={'600'}
                showLoading={loading}
              />
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigateBottomSheet('Main', {})}>
              <Text style={styles.cancelText}>Отменить заказ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GHScrollView>

      <PromocodeModal
        visible={showPromocodeModal}
        onClose={() => setShowPromocodeModal(false)}
        promocode={inputCodeValue || ''}
        handleSearchChange={handleSearchChange}
        apply={debouncedApplyPromoCode}
        promocodeError={promoError}
        fetching={isMutating}
      />
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: dp(22),
    paddingTop: dp(5),
    paddingBottom: dp(100), // Add bottom padding for scroll content
  },
  title: {
    fontSize: dp(24),
    fontWeight: '600',
    color: '#000',
    marginBottom: dp(12),
  },
  paymentCard: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    borderRadius: dp(25),
    padding: dp(25),
    marginTop: dp(15),
  },
  section: {
    fontSize: dp(20),
    fontWeight: '600',
    color: '#000',
    marginBottom: dp(12),
  },
  choice: {
    marginTop: dp(15),
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgeWrapper: {
    paddingTop: dp(15),
    marginRight: dp(10),
  },
  paymentActions: {
    marginTop: dp(30),
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: dp(12),
    padding: dp(8),
  },
  cancelText: {
    fontSize: dp(12),
    textDecorationLine: 'underline',
    color: '#666',
  },
});

export { Payment };
