import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/metrics';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  ScrollView,
  ScrollView as GHScrollView,
} from 'react-native-gesture-handler';

// styled components
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {BusinessHeader} from '@components/Business/Header';

import {useNavigation} from '@react-navigation/native';
import {useAppState} from '@context/AppContext';
import {dp} from '../../../utils/dp';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {Button} from '@styled/buttons';

import useStore from '../../../state/store';

import {LoadingModal} from '@styled/views/LoadingModal';
import {CustomModal} from '@styled/views/CustomModal';
import {PromocodeModal} from '@styled/views/PromocodeModal';
import Switch from '@styled/buttons/CustomSwitch';
import {confirmPayment, tokenize} from '../../../native';
import {PaymentMethodTypesEnum} from '../../../types/PaymentType';

import {PaymentConfig} from 'src/types/PaymentConfig';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {create as createOrderApi, pingPos} from '../../../api/order';
import {create} from '../../../api/payment';
import {useValidatePromoCode} from '../../../api/hooks/useApiOrder.ts';
import {IValidatePromoCodeRequest} from '../../../types/api/order/req/IValidatePromoCodeRequest.ts';
import {ICreateOrderRequest} from '../../../types/api/order/req/ICreateOrderRequest.ts';
import {SendStatus} from '../../../types/api/order/res/ICreateOrderResponse.ts';
import {X} from 'react-native-feather';
import {GREY} from '@utils/colors.ts';

enum OrderStatus {
  START = 'start',
  PROCESSING = 'processing',
  END = 'end',
}

const Payment = () => {
  const {user, loadUser, isBottomSheetOpen} = useStore();
  const navigation: any = useNavigation();

  const {state} = useAppState();

  const [btnLoader, setBtnLoader] = useState(false);

  const [promocode, setPromocode] = useState<string>('');
  const [usedPoints, setUsedPoints] = useState(0);

  const isOpened = isBottomSheetOpen
  const order = state.order;

  const [discount, setDiscount] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderSatus] = useState<OrderStatus | null>(null);

  const [promoError, setPromoError] = useState<string | null>(null);

  const {
    mutate,
    isPending,
    data,
    error: promocodeError,
  } = useValidatePromoCode();

  useEffect(() => {
    if (promocodeError) {
      setPromocode('');
    }
  }, [promocodeError]);

  useEffect(() => {
    if (data?.discount && showPromocodeModal) {
      setDiscount(data.discount);
      setShowPromocodeModal(false);
      setPromoError(null);
    }
  }, [data]);

  const applyPromocode = async () => {
    const body: IValidatePromoCodeRequest = {
      promoCode: promocode,
      carWashId: Number(order.id),
    };
    mutate(body);
  };

  const createOrder = async () => {
    if (!user) return
    try {
      setBtnLoader(true);
      const apiKey: string = 'live_MTY4OTA1wrqkTr02LhhiyI4db69pN15QUFq3o_4qf_g';
      const storeId: string = '168905';
      const discountSum: number = (order.sum * discount) / 100;
      const realSum: number = Math.max(order.sum - discountSum - usedPoints, 1);
      const pointsSum = realSum === 1 ? usedPoints - realSum : usedPoints;

      const bayStatus = await pingPos({
        carWashId: order.id,
        bayNumber: order.box,
      });

      if (bayStatus.status !== 'Free') {
        setError('Аавтомойка не может принять заказ');
        setBtnLoader(false);
        return;
      }

      // Start tokenization and await the result
      const paymentConfigParams: PaymentConfig = {
        clientApplicationKey: apiKey, // string
        shopId: storeId, // string
        title: `${order.name}`, // string
        subtitle: 'АМС', // string
        price: realSum, // number
        paymentMethodTypes: [PaymentMethodTypesEnum.BANK_CARD], // optional array of PaymentMethodTypesEnum
        customerId: String(user.id),
        authCenterClientId: null,
        userPhoneNumber: null, // optional string
        gatewayId: null, // optional string
        returnUrl: null, // optional string
        googlePaymentMethodTypes: null, // optional array of GooglePaymentMethodTypesEnum
        applePayMerchantId: null, // optional string
        isDebug: false, // optional boolean
      };

      const {token, paymentMethodType} = await tokenize(paymentConfigParams);

      if (!token) {
        setError('Что то пошло не так ...');
        setBtnLoader(false);
        return;
      }

      setOrderSatus(OrderStatus.START);

      const payment = await create({
        paymentToken: token,
        amount: realSum.toString(),
        description: paymentConfigParams.subtitle,
      });

      const confirmationUrl = payment.confirmation.confirmation_url;
      const paymentId = payment.id;

      setOrderSatus(null);
      await confirmPayment({confirmationUrl, paymentMethodType});
      setOrderSatus(OrderStatus.PROCESSING);

      const createOrderRequest: ICreateOrderRequest = {
        transactionId: paymentId,
        sum: realSum,
        rewardPointsUsed: pointsSum,
        carWashId: Number(order.id),
        bayNumber: Number(order.box),
      };

      if (data?.id && promocode) {
        createOrderRequest.sum = realSum + discountSum;
        createOrderRequest.promoCodeId = data.id;
      }

      createOrderApi(createOrderRequest).then(data => {
        console.log(JSON.stringify(data, null, 2));
        if (data.sendStatus === SendStatus.SUCCESS) {
          loadUser().then(() => {
            setOrderSatus(OrderStatus.END);
            setBtnLoader(false);
          });
        }
      });

      setTimeout(() => {
        setOrderSatus(null);
        navigateBottomSheet('Main', {});
        // route.params.bottomSheetRef.current.scrollTo(MIN_TRANSLATE_Y)
      }, 5000);
    } catch (error) {
      console.log('Error:', JSON.stringify(error));
      setOrderSatus(null);
      setBtnLoader(false);
      setError('Что то пошло не так ...');
      // Handle errors appropriately
    }
  };

  const applyPoints = () => {
    if (!user) return
    let leftToPay = order.sum - (order.sum * discount) / 100;

    if (user.cards!.balance >= leftToPay) {
      setUsedPoints(leftToPay);
    } else {
      setUsedPoints(user.cards!.balance);
    }
  };

  const debounceTimeout: any = useRef(null);

  // Debounce function for search
  const debounce = (func: any, delay: number) => {
    return function (...args: any) {
      clearTimeout(debounceTimeout.current);

      debounceTimeout.current = setTimeout(() => {
        func();
      }, delay);
    };
  };

  // Create a debounced version of the search function with a delay of 500ms
  const debouncedSearch = debounce(applyPromocode, 1000);

  const handleSearchChange = (val: string) => {
    setPromocode(val);
  };

  const [toggled, setToggled] = useState(false);

  const [showPromocodeModal, setShowPromocodeModal] = useState(false);

  const onToggle = () => {
    if (!toggled) {
      setToggled(true);
      applyPoints();
    } else {
      setToggled(false);
      setUsedPoints(0);
    }
  };

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
          isVisible={error ? true : false}
          text={error ? error : ''}
          onClick={() => {
            setError(null);
          }}
        />
        <LoadingModal
          isVisible={orderStatus ? true : false}
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
              setPromoError(null);
            }}
            promocode={promocode}
            handleSearchChange={handleSearchChange}
            apply={() => debouncedSearch(promocode)}
            promocodeError={promoError}
            fetching={isPending}
          />
        ) : (
          <>
            <BusinessHeader
              type="box"
              navigation={navigation}
              position={'95%'}
              box={order?.box}
            />
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
              <View style={styles.choice}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: dp(6),
                  }}>
                  {order.name ? (
                    <Text
                      style={{
                        fontWeight: '300',
                        fontSize: dp(15),
                        color: 'rgba(0, 0, 0, 1)',
                      }}>
                      {order.name}
                    </Text>
                  ) : (
                    <Text />
                  )}
                  <Text
                    style={{
                      color: 'rgba(0, 0, 0, 1)',
                      fontWeight: '700',
                      fontSize: dp(16),
                    }}>
                    {order.sum ? order.sum : 0} ₽
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: dp(6),
                  }}>
                  <Text
                    style={{
                      fontWeight: '300',
                      fontSize: dp(15),
                      color: 'rgba(0, 0, 0, 1)',
                    }}>
                    Ваш Cashback
                  </Text>
                  {!user || !user.tariff || user.tariff == 0 ? (
                    <View>
                      <SkeletonPlaceholder borderRadius={10}>
                        <SkeletonPlaceholder.Item
                          width={40}
                          height={15}
                          alignSelf={'flex-end'}
                        />
                      </SkeletonPlaceholder>
                    </View>
                  ) : (
                    <Text
                      style={{
                        color: 'rgba(0, 0, 0, 1)',
                        fontWeight: '700',
                        fontSize: dp(16),
                      }}>
                      {Math.round((order.sum * user.tariff) / 100)} ₽
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    marginTop: dp(35),
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: '300',
                        fontSize: dp(15),
                        color: 'rgba(0, 0, 0, 1)',
                      }}>
                      Списать бонусы Onvi
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={applyPoints}>
                      {!user || !user.cards || !user.cards.balance == null ? (
                        <View>
                          <SkeletonPlaceholder borderRadius={20}>
                            <SkeletonPlaceholder.Item
                              width={60}
                              height={25}
                              alignSelf={'flex-end'}
                            />
                          </SkeletonPlaceholder>
                        </View>
                      ) : (
                        <Switch
                          value={toggled}
                          onValueChange={onToggle}
                          activeText={`${Math.min(
                            Number(user.cards.balance),
                            Number(
                              order.sum
                                ? order.sum -
                                    (order.sum * discount) / 100 -
                                    usedPoints || usedPoints - 1
                                : 0,
                            ),
                          )}`}
                          inActiveText={`${Math.min(
                            Number(user.cards.balance),
                            Number(
                              order.sum
                                ? order.sum -
                                    (order.sum * discount) / 100 -
                                    usedPoints
                                : 0,
                            ),
                          )}`}
                          backgroundActive="#A3A3A6"
                          backgroundInActive="#000"
                          circleImageActive={require('../../../assets/icons/small-icon.png')} // Replace with your image source
                          circleImageInactive={require('../../../assets/icons/small-icon.png')} // Replace with your image source
                          circleSize={dp(18)} // Adjust the circle size as needed
                          switchBorderRadius={20}
                          width={dp(55)} // Adjust the switch width as needed
                          textStyle={{fontSize: dp(13), color: 'white'}}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: dp(15),
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      justifyContent: 'center',
                      width: dp(219),
                      height: dp(31),
                      paddingLeft: dp(12),
                      paddingRight: dp(5.38),
                      borderRadius: dp(30),
                    }}
                    onPress={() => {
                      setShowPromocodeModal(true);
                    }}>
                    <Text style={{fontSize: dp(10), fontWeight: '500'}}>
                      ПРОМОКОД
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {discount ? (
                    <View style={{paddingTop: dp(15)}}>
                      <Button
                        label={`У ВАС ЕСТЬ ПРОМОКОД НА ${discount}%`}
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
                        label={`ИСПОЛЬЗОВАНО ${Number(
                          order.sum
                            ? order.sum -
                                (order.sum * discount) / 100 -
                                usedPoints || usedPoints - 1
                            : 0,
                        )} БАЛОВ`}
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
                </ScrollView>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: dp(38),
                  alignItems: 'center',
                }}>
                <View style={{display: 'flex', flexDirection: 'column'}}>
                  <Text style={{fontWeight: '600', fontSize: dp(10)}}>
                    ИТОГО
                  </Text>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: dp(36),
                      color: '#000',
                    }}>
                    {order.sum
                      ? order.sum - (order.sum * discount) / 100 - usedPoints ||
                        1
                      : 0}{' '}
                    ₽
                  </Text>
                </View>
                <Button
                  label="Оплатить"
                  onClick={createOrder}
                  color="blue"
                  width={158}
                  height={43}
                  fontSize={18}
                  fontWeight={'600'}
                  showLoading={btnLoader}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  height: '35%',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  style={{
                    height: dp(45),
                    width: dp(45),
                    backgroundColor: GREY,
                    borderRadius: dp(50),
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                  }}
                  onPress={() => {
                    navigateBottomSheet('Main', {});
                  }}>
                  <X stroke={'#000000'} aria-label={'Hello'} />
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#494949',
                    letterSpacing: 1,
                    fontSize: dp(12),
                  }}>
                  Отмена
                </Text>
              </View>
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
