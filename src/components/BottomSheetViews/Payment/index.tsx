// import React, { useEffect, useState, useRef } from 'react';
// import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';

// import { useAxios } from '@hooks/useAxios';

// // styled components
// import { BusinessHeader } from '@components/Business/Header';

// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useStateSelector } from '@context/AppContext';
// import  { dp } from "../../../utils/dp"

// import { OnviSwitch } from "@styled/buttons";

// import { navigateBottomSheet } from '@navigators/BottomSheetStack';

// import { Button } from '@styled/buttons';

// import { useAuth } from '@context/AuthContext';

// import Toast from 'react-native-alerts-message';
import { horizontalScale, moderateScale, verticalScale } from "../../../utils/metrics";
// import {BottomSheetScrollView, BottomSheetTextInput} from "@gorhom/bottom-sheet";

// const height = dp(Dimensions.get('screen').height);

// const MIN_TRANSLATE_Y = -dp(height) / dp(4);

// function AddIcon() {
//   return (
//     <Text style={{
//         fontSize: moderateScale(25),
//         color: "rgba(163, 163, 166, 1)"
//     }}>+</Text>
//   )
// }

// const cards = [
//     {
//         bank: "tinkoff",
//         image: "https://pbs.twimg.com/media/DJFFVO6XUAACz_o.jpg:large",
//         number: "1111222233337689",
//         id: 1
//     }
// ]

// const Payment = () => {

//     const navigation: any = useNavigation();
//     const route: any = useRoute()

//     const [promocode, setPromocode] = useState<any>("")
//     const [cashback, setCashback] = useState(0)
//     const [usedPoints, setUsedPoints] = useState(0)

//     const isOpened = useStateSelector((state: any) => state.bottomSheetOpened);

//     const [discount, setDiscount] = useState(0)

//     const convertNumber = (number: string) => {
//         return "..." + number.substring(number.length - 4)
//     }

//     const api = useAxios("CORE_URL")

//     const getTariff = async () => {
//         // console.log("Wait")
//         await api.get("/account/tariff").then((data) => {

//           setCashback(data.data.data.cashBack)
//         }).catch(err => console.log(err.response))
//     }

//     const applyPromocode = async () => {
//         console.log('TRY!')
//         await api.post("/order/promo/validate", {
//             "promoCode": promocode,
//             "carWashId": 66
//         }).then((data) => {
//             if (data && data.data && data.data.data && data.data.data.discount) {
//                 setDiscount(data.data.data.discount)
//                 Toast.show({
//                     type: 'success',
//                     text1: 'Промокод успешно применен!',
//                   });
//             }
//         }).catch(err => {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Не получилось получить промокод',
//             });
//         })
//     }

//     // get the payment info
//     useEffect(() => {
//         getTariff()
//     }, [])

//     const order = useStateSelector((state: any) => state.order);

//     const createOrder = async () => {
//         await api.post("/order/create", {
//             "transactionId": "test-order-123456",
//             "sum": Number(order.sum),
//             "rewardPointsUsed": Number(usedPoints),
//             "carWashId": Number(order.id),
//             "bayNumber": Number(order.box),
//         }).then((data) => {
//             Toast.show({
//                 type: 'success',
//                 text1: 'Ура! Оплата прошла успешно!',
//             });
//             navigateBottomSheet('Main', {})
//             route.params.bottomSheetRef.current.scrollTo(MIN_TRANSLATE_Y)
//         }).catch(err => {
//             Toast.show({
//                 type: 'error',
//                 text1: 'Не получилось оплатить!',
//             });
//             navigateBottomSheet('Main', {})
//             route.params.bottomSheetRef.current.scrollTo(MIN_TRANSLATE_Y)
//         })
//     }

//     const { store }: any = useAuth()

//     const applyPoints = () => {
//         let leftToPay = order.sum - (order.sum * discount / 100)

//         // order.sum - (order.sum * discount / 100) - usedPoints

//         if (store.balance >= leftToPay) {
//             setUsedPoints(leftToPay)
//         } else {
//             setUsedPoints(store.balance)
//         }


//     }

//     const debounceTimeout: any = useRef(null);

//   // Debounce function for search
//   const debounce = (func: any, delay: number) => {
//     return function (...args: any) {
//         clearTimeout(debounceTimeout.current);

//         debounceTimeout.current = setTimeout(() => {
//             func()
//         }, delay);
//     };
//   };

//   // Create a debounced version of the search function with a delay of 500ms
//   const debouncedSearch = debounce(applyPromocode, 1000);

//   const handleSearchChange = (val: string) => {
//     setPromocode(val);
//     debouncedSearch(val);
//   };

//   const [toggled, setToggled] = useState(false)

//   const onToggle = () => {
//     if (!toggled) {
//         setToggled(true)
//         applyPoints()
//     } else {
//         setToggled(false)
//         setUsedPoints(0)
//     }
//   }

//     return (
//         <View style={{ ...styles.container, paddingLeft: horizontalScale(20), paddingRight: horizontalScale(20)}}>
//                 <TouchableOpacity style={{display: "flex", justifyContent: "center", paddingTop: dp(15)}} onPress={() =>  navigation.goBack()}>
//                     <Image source={require("../../../assets/icons/close.png")} style={{width: horizontalScale(22), height: verticalScale(22), alignSelf: "flex-start", resizeMode: 'contain'}} />
//                 </TouchableOpacity>
//                         <BusinessHeader type="empty" navigation={navigation} />
//                         <Text style={styles.title}>Оплата</Text>
//                         <BottomSheetScrollView contentContainerStyle={{ ...styles.paymentCard}} nestedScrollEnabled={true} scrollEnabled={true}>
//                             <Text style={styles.section}>Способ оплаты</Text>
//                             <View
//                                 style={styles.scrollViewContent}
//                             >
//                                 {cards.map((card) => (
//                                 <View style={styles.card} key={card.id}>
//                                     <Image source={{ uri: card.image }} style={styles.logo} />
//                                     <View style={styles.number}>
//                                         <Text style={styles.numberLabel}>{convertNumber(card.number)}</Text>
//                                     </View>
//                                 </View>
//                                 ))}
//                                 <TouchableOpacity onPress={() => navigation.navigate('AddCard', route.params)} style={styles.cardAdd}>
//                                     <AddIcon />
//                                     <Text style={styles.addCardLabel}>ДОБАВИТЬ КАРТУ</Text>
//                                 </TouchableOpacity>
//                             </View>
//                             <Text style={styles.section}>Ваш выбор</Text>
//                             <View style={styles.choice}>
//                                 <View style={{display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
//                                     {order.name ? <Text style={{fontWeight: "300", fontSize: moderateScale(12), color: "rgba(0, 0, 0, 1)"}}>Программа "{order.name}"</Text> : <Text></Text>}
//                                     <Text style={{color: "rgba(0, 0, 0, 1)", fontWeight: "700", fontSize: moderateScale(12)}}>{order.sum ? order.sum : 0} ₽</Text>
//                                 </View>
//                                 {cashback !== 0 ? (
//                                     <View style={{display: "flex", flexDirection: "row", justifyContent: 'space-between', marginTop: verticalScale(6)}}>
//                                         <Text style={{fontWeight: "300", fontSize: moderateScale(12), color: "rgba(0, 0, 0, 1)"}}>Ваш Cashback</Text>
//                                         <Text style={{color: "rgba(0, 0, 0, 1)", fontWeight: "700", fontSize: moderateScale(12)}}>{cashback} ₽</Text>
//                                     </View>
//                                 ) : <></>}
//                                 <View style={{marginTop: verticalScale(10), display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
//                                     <View>
//                                         <Text style={{fontWeight: "300", fontSize: moderateScale(12), color: "rgba(0, 0, 0, 1)"}}>Списать бонусы Onvi</Text>
//                                     </View>
//                                     <View style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
//                                         <Text style={{fontWeight: "500", fontSize: moderateScale(12), color: "rgba(0, 0, 0, 1)", marginRight: horizontalScale(5)}}>{Math.min(Number(store.balance), Number(order.sum ? (order.sum - (order.sum * discount / 100) - usedPoints) : 0))}</Text>
//                                         <TouchableOpacity onPress={applyPoints}>
//                                             <OnviSwitch
//                                                 position="relative"
//                                                 onToggle={onToggle}
//                                                 overlay={true}
//                                             />
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                                 <View style={{display: 'flex', flexDirection: "row", marginTop: verticalScale(20), justifyContent: 'flex-start'}}>
                                //    <BottomSheetTextInput
                                //         value={promocode}
                                //         onChangeText={(val) => {
                                //             handleSearchChange(val)
                                //         }}
                                //         placeholder='Введите промокод'
                                //         style={{ ...styles.promoCodeTextInput}}
                                //         placeholderTextColor="rgba(255, 255, 255, 1)"
                                //    />
//                                 </View>
//                                 <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
//                                     {discount ? <View style={{paddingTop: verticalScale(12)}}><Button label={`У ВАС ЕСТЬ ПРОМОКОД НА ${discount}%`} onClick={() => {}} color='blue' width={horizontalScale(184)} height={verticalScale(31)} fontSize={moderateScale(10)} fontWeight={"600"} /></View> : <></>}
//                                     {usedPoints ? <View style={{paddingTop: verticalScale(12)}}><Button label={`ИСПОЛЬЗОВАНО ${usedPoints} БАЛОВ`} onClick={() => {}} color='blue' width={horizontalScale(184)} height={verticalScale(31)} fontSize={moderateScale(10)} fontWeight={"600"} /></View> : <></>}
//                                 </ScrollView>
//                             </View>
//                             <View style={{display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}}>
//                                 <View style={{display: 'flex', flexDirection: "column"}}>
//                                     <Text style={{ fontWeight: "600", fontSize: moderateScale(10) }}>ИТОГО</Text>
//                                     <Text style={{ fontWeight: "600", fontSize: moderateScale(34), color: "#000" }}>{order.sum ? (order.sum - (order.sum * discount / 100) - usedPoints) : 0} ₽</Text>
//                                 </View>
//                                 <Button label='Оплатить' onClick={createOrder} color='blue' width={horizontalScale(158)} height={verticalScale(40)} fontSize={moderateScale(16)} fontWeight={"600"} />
//                             </View>
//                         </BottomSheetScrollView>
//         </View>
//     )
// }


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         borderRadius: moderateScale(22),
//         flexDirection: 'column',
//     },
//     title: {
//         fontSize: moderateScale(22),
//         fontWeight: '500',
//         color: "#000"
//     },
//     text: {
//         fontSize: dp(16),
//         fontWeight: '400',
//         color: "#000"
//     },
//     middle: {
//         flex: 1,
//         paddingLeft: dp(22),
//         paddingRight: dp(22),
//     },
//     middleText: {
//         fontSize: dp(36),
//         fontWeight: "600"
//     },
//     boxes: {
//         paddingTop: dp(81)
//     },
//     carImage: {
//         width: dp(32),
//         height: dp(32)
//     },
//     button: {
//         width: "100%",
//         display: "flex",
//         alignItems: "center",
//         marginTop: dp(22)
//     },
//     paymentCard: {
//         display: "flex",
//         justifyContent: 'space-evenly',
//         backgroundColor: "#F5F5F5",
//         width: "100%",
//         height: "90%",
//         borderRadius: moderateScale(25),
//         paddingTop: verticalScale(10),
//         paddingLeft: horizontalScale(25),
//         paddingRight: horizontalScale(25),
//         marginTop: verticalScale(20),
//     },
//     section: {
//         fontSize: moderateScale(18),
//         fontWeight: '600',
//         color: "#000",
//     },
//     /*Cards*/
//     scrollViewContent: {
//         flexDirection: 'row',
//     },
//       card: {
//         width: horizontalScale(90),
//         height: verticalScale(50),
//         marginRight: horizontalScale(10),
//         paddingRight: horizontalScale(6),
//         borderRadius: moderateScale(8),
//         backgroundColor: '#FFFFFF',
//         display: "flex",
//         flexDirection: 'column',
//       },
//       cardAdd: {
//         width: horizontalScale(90),
//         height: verticalScale(50),
//         marginRight: horizontalScale(10),
//         borderRadius: moderateScale(8),
//         backgroundColor: '#FFFFFF',
//         display: "flex",
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: "center"
//       },
//       cardTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: "#000"
//       },
//       cardDescription: {
//         fontSize: 14,
//         color: '#888',
//       },
//       logo: {
//         width: horizontalScale(34),
//         height: verticalScale(26),
//         resizeMode: 'contain'
//       },
//       number: {
//         justifyContent: 'center',
//         alignItems:'flex-end',
//         color: "#000",

//       },
//       numberLabel: {
//         fontWeight: "500",
//         fontSize: moderateScale(13),
//         color: "#000",
//       },
//       addCardLabel: {
//         color: "rgba(163, 163, 166, 1)",
//         fontWeight: "500",
//         fontSize: moderateScale(10),
//         paddingLeft: horizontalScale(3),
//       },
//       choice: {
//         display: 'flex',
//         flexDirection: "column"
//       },
//       inputContainer: {
//         paddingTop: verticalScale(14),
//         paddingRight: horizontalScale(14),
//         paddingLeft: horizontalScale(0),
//         paddingBottom: verticalScale(14),
//       },
    //   promoCodeTextInput: {
    //       backgroundColor: "rgba(216, 217, 221, 1)",
    //       borderRadius: moderateScale(25),
    //       alignSelf: "stretch",
    //       width: horizontalScale(200),
    //       height: verticalScale(35),
    //       fontSize: moderateScale(10),
    //       textAlign: "left",
    //       padding: 5,
    //       color: "#000000",
    //   }
// });


// export { Payment };


/*
       Selecting payment method
       <Text style={styles.section}>Способ оплаты</Text>
                            <ScrollView style={{display: "flex", flexDirection: "row", paddingTop: dp(20), paddingBottom: dp(20) }} nestedScrollEnabled={true} scrollEnabled={true} horizontal={true}>
                                {cards.map((card) => (
                                <View style={styles.card} key={card.id}>
                                    <Image source={{ uri: card.image }} style={styles.logo} />
                                    <View style={styles.number}>
                                        <Text style={styles.numberLabel}>{convertNumber(card.number)}</Text>
                                    </View>
                                </View>
                                ))}
                                <TouchableOpacity onPress={() => navigation.navigate('AddCard', route.params)} style={styles.cardAdd}>
                                    <AddIcon />
                                    <Text style={styles.addCardLabel}>ДОБАВИТЬ КАРТУ</Text>
                                </TouchableOpacity>
                            </ScrollView>
 */



import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, ScrollView as Scroll,   KeyboardAvoidingView, Platform, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { ScrollView as GHScrollView } from 'react-native-gesture-handler';


import { useAxios } from '@hooks/useAxios';

// styled components
import {BottomSheetScrollView, BottomSheetTextInput} from "@gorhom/bottom-sheet";
import { BusinessHeader } from '@components/Business/Header';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useStateSelector } from '@context/AppContext';
import  { dp } from "../../../utils/dp"

import { OnviSwitch } from "@styled/buttons";

import { navigateBottomSheet } from '@navigators/BottomSheetStack';

import { Button } from '@styled/buttons';

import { useAuth } from '@context/AuthContext';

import Toast from 'react-native-toast-message';
import { NativeModules } from 'react-native';
import {LoadingModal} from "@styled/views/LoadingModal";
import {CustomModal} from "@styled/views/CustomModal";
import { PromocodeModal } from "@styled/views/PromocodeModal";
import Switch from "@styled/buttons/CustomSwitch";
import {YOKASSA_KEY, YOKASSA_SHOP_ID} from "@env";

const height = dp(Dimensions.get('screen').height);
import uuid from 'react-native-uuid';

const MIN_TRANSLATE_Y = -dp(height) / dp(4);

function AddIcon() {
  return (
    <Text style={{
        fontSize: dp(40),
        color: "rgba(163, 163, 166, 1)"
    }}>+</Text>
  )
}

const cards = [
    {
        bank: "tinkoff",
        image: "https://pbs.twimg.com/media/DJFFVO6XUAACz_o.jpg:large",
        number: "1111222233337689",
        id: 1
    }
]


enum OrderStatus  {
    START = 'start',
    PROCESSING = 'processing',
    END = 'end'
}

const Payment = () => {

    const { store }: any = useAuth()
    const navigation: any = useNavigation();
    const route: any = useRoute()

    const [promocode, setPromocode] = useState<string>("")
    const [cashback, setCashback] = useState(0)
    const [usedPoints, setUsedPoints] = useState(0)

    const isOpened = useStateSelector((state: any) => state.bottomSheetOpened);

    const [discount, setDiscount] = useState(0)

    const [error, setError] = useState<string | null>(null);
    const [orderStatus, setOrderSatus] = useState<OrderStatus | null>(null);

    const [promoError, setPromoError] = useState<string | null>(null)

    const convertNumber = (number: string) => {
        return "..." + number.substring(number.length - 4)
    }

    const api = useAxios("CORE_URL")

    const getTariff = async () => {
        // console.log("Wait")
        await api.get("/account/tariff").then((data) => {

          setCashback(data.data.data.cashBack)
        }).catch(err => console.log(err.response))
    }

    const applyPromocode = async () => {
        console.log('TRY!')
        await api.post("/order/promo/validate", {
            "promoCode": promocode,
            "carWashId": 66
        }).then((data) => {
            if (data && data.data && data.data.data && data.data.data.discount) {
                setDiscount(data.data.data.discount)
                Toast.show({
                    type: 'customSuccessToast',
                    text1: 'Промокод успешно применен!',
                });

                setShowPromocodeModal(false)
                setPromoError(null)
            }
        }).catch(err => {
            Toast.show({
                type: 'customErrorToast',
                text1: 'Не получилось получить промокод',
            });

            setPromoError("Промокод не работает")
        })
    }

    // get the payment info
    useEffect(() => {
        getTariff()
    }, [])

    const order = useStateSelector((state: any) => state.order);

    const createOrder = async () => {
        try {
            const orderName =`Заказ ${order.name}`;
            const orderDescription = `№ ${uuid.v4()}`;
            const apiKey = YOKASSA_KEY;
            const storeId = YOKASSA_SHOP_ID;

            const bayStatus = await api.get(`/order/ping?carWashId=${order.id}&bayNumber=${order.box}`);


            if (bayStatus.data.data.status !== 'Free') {
                setError("Аавтомойка не может принять заказ");
                return
            }
            // Start tokenization and await the result
            const result = await NativeModules.YooKassa.startTokenize(
                String(order.sum),
                orderName,
                orderDescription,
                apiKey,
                storeId,
                String(store.id)
            );


            const token = result.token;

            if (!token) {
                setError("Что то пошло не так...");
                return;
            }

            setOrderSatus(OrderStatus.START);

            // Make the API call to create payment
            const response = await api.post('/payment', {
                "paymentToken": token,
                "amount": String(order.sum),
                "description": orderDescription
            });

            const url = response.data.data.confirmation.confirmation_url;

            setOrderSatus(null);
            const verification = await NativeModules.YooKassa.start3DSecure(url);
            setOrderSatus(OrderStatus.PROCESSING);

            await api.post("/order/create", {
                "transactionId": "test-order-123456",
                "sum": Number(order.sum),
                "rewardPointsUsed": Number(usedPoints),
                "carWashId": Number(order.id),
                "bayNumber": Number(order.box),
            });
            setOrderSatus(OrderStatus.END);
            setTimeout(() => {
                setOrderSatus(null);
                navigateBottomSheet('Main', {})
               // route.params.bottomSheetRef.current.scrollTo(MIN_TRANSLATE_Y)
            }, 3000)
        } catch (error) {
            console.log("Error:", JSON.stringify(error));
            setOrderSatus(null);
            setError("Что то пошло не так...");
            // Handle errors appropriately
        }



        /*
        console.log("Create Order: ", {
            "transactionId": "test-order-123456",
            "sum": Number(order.sum),
            "rewardPointsUsed": Number(usedPoints),
            "carWashId": Number(order.id),
            "bayNumber": Number(order.box),
        })
        await api.post("/order/create", {
            "transactionId": "test-order-123456",
            "sum": Number(order.sum),
            "rewardPointsUsed": Number(usedPoints),
            "carWashId": Number(order.id),
            "bayNumber": Number(order.box),
        }).then((data) => {
            Toast.show({
                type: 'success',
                text1: 'Ура! Оплата прошла успешно!',
            });
            navigateBottomSheet('Main', {})
            route.params.bottomSheetRef.current.scrollTo(MIN_TRANSLATE_Y)
        }).catch(err => {
            Toast.show({
                type: 'error',
                text1: 'Не получилось оплатить!',
            });
            navigateBottomSheet('Main', {})
            route.params.bottomSheetRef.current.scrollTo(MIN_TRANSLATE_Y)
        })

         */
    }

    const applyPoints = () => {
        let leftToPay = order.sum - (order.sum * discount / 100)

        if (store.balance >= leftToPay) {
            setUsedPoints(leftToPay)
        } else {
            setUsedPoints(store.balance)
        }
    }

    const debounceTimeout: any = useRef(null);

  // Debounce function for search
  const debounce = (func: any, delay: number) => {
    return function (...args: any) {
        clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            func()
        }, delay);
    };
  };

  // Create a debounced version of the search function with a delay of 500ms
  const debouncedSearch = debounce(applyPromocode, 1000);

  const handleSearchChange = (val: string) => {
    setPromocode(val);
  };

  const [toggled, setToggled] = useState(false)

  const [showPromocodeModal, setShowPromocodeModal] = useState(false)

  const onToggle = () => {
    if (!toggled) {
        setToggled(true)
        applyPoints()
    } else {
        setToggled(false)
        setUsedPoints(0)
    }
  }

    return (
        <View style={{ ...styles.container, paddingLeft: dp(22), paddingRight: dp(22), paddingTop: dp(20)}}>
            <BottomSheetScrollView nestedScrollEnabled={true} scrollEnabled={true}>
                        <CustomModal
                            isVisible={error ? true : false}
                            text={error ? error : ""}
                            onClick={() => {
                                setError(null);
                            }}
                        />
                        <LoadingModal isVisible={orderStatus ? true : false}
                                      color={"#FFFFFF"}
                                      status={orderStatus ? orderStatus : 'start'}
                                      stageText={{
                                          start: 'Подготавливаем оборудование...',
                                          processing: 'Зачисляем деньги...',
                                          end: 'Удачной мойки'
                                      }}
                                      modalStyle={{}}
                                      textStyle={{}} />

                        {showPromocodeModal ? <PromocodeModal
                            onClose={() => {
                                setPromocode("")
                                setShowPromocodeModal(false)
                                setPromoError(null)
                            }}
                            promocode={promocode}
                            handleSearchChange={handleSearchChange}
                            apply={() => debouncedSearch(promocode)}
                            promocodeError={promoError}
                        /> : (
                        <>
                            <BusinessHeader type="empty" navigation={navigation} position={"95%"} />
                            <Text style={styles.title}>Оплата</Text>
                            <GHScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, ...styles.paymentCard, paddingBottom: dp(300)}} nestedScrollEnabled={true} scrollEnabled={isOpened}>
                                <Text style={styles.section}>Ваш выбор</Text>
                                <View style={styles.choice}>
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: 'space-between', marginTop: dp(6) }}>
                                        {order.name ? <Text style={{fontWeight: "300", fontSize: dp(15), color: "rgba(0, 0, 0, 1)"}}>Программа "{order.name}"</Text> : <Text></Text>}
                                        <Text style={{color: "rgba(0, 0, 0, 1)", fontWeight: "700", fontSize: dp(16)}}>{order.sum ? order.sum : 0} ₽</Text>
                                    </View>
                                    {cashback !== 0 ? (
                                        <View style={{display: "flex", flexDirection: "row", justifyContent: 'space-between', marginTop: dp(6)}}>
                                            <Text style={{fontWeight: "300", fontSize: dp(15), color: "rgba(0, 0, 0, 1)"}}>Ваш Cashback</Text>
                                            <Text style={{color: "rgba(0, 0, 0, 1)", fontWeight: "700", fontSize: dp(16)}}>{cashback} ₽</Text>
                                        </View>
                                    ) : <></>}
                                    <View style={{marginTop: dp(35), display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                                        <View>
                                            <Text style={{fontWeight: "300", fontSize: dp(15), color: "rgba(0, 0, 0, 1)"}}>Списать бонусы Onvi</Text>
                                        </View>
                                        <View style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
                                            <TouchableOpacity onPress={applyPoints}>
                                                <Switch
                                                    value={toggled}
                                                    onValueChange={onToggle}
                                                    activeText={`${Math.min(Number(store.balance), Number(order.sum ? (order.sum - (order.sum * discount / 100) - usedPoints) : 0))}`}
                                                    inActiveText={`${Math.min(Number(store.balance), Number(order.sum ? (order.sum - (order.sum * discount / 100) - usedPoints) : 0))}`}
                                                    backgroundActive="#A3A3A6"
                                                    backgroundInActive="#000"
                                                    circleImageActive={require('../../../assets/icons/small-icon.png')} // Replace with your image source
                                                    circleImageInactive={require('../../../assets/icons/small-icon.png')} // Replace with your image source
                                                    circleSize={dp(18)} // Adjust the circle size as needed
                                                    switchBorderRadius={20}
                                                    width={dp(55)} // Adjust the switch width as needed
                                                    textStyle={{ fontSize: dp(13), color: 'white' }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{display: 'flex', flexDirection: "row", marginTop: dp(15)}}>
                                        <TouchableOpacity style={{ backgroundColor: "#ffffff", display: 'flex', justifyContent: "center", width: dp(219), height: dp(31), paddingLeft: dp(12),  paddingRight: dp(5.38), borderRadius: dp(30) }} onPress={() => {
                                            setShowPromocodeModal(true)
                                        }}>
                                            <Text style={{fontSize: dp(10), fontWeight: "500" }}>ПРОМОКОД</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {discount ? <View style={{paddingTop: dp(15)}}><Button label={`У ВАС ЕСТЬ ПРОМОКОД НА ${discount}%`} onClick={() => {}} color='blue' width={184} height={31} fontSize={10} fontWeight={"600"} /></View> : <></>}
                                        {usedPoints ? <View style={{paddingTop: dp(15)}}><Button label={`ИСПОЛЬЗОВАНО ${usedPoints} БАЛОВ`} onClick={() => {}} color='blue' width={184} height={31} fontSize={10} fontWeight={"600"} /></View> : <></>}
                                    </ScrollView>
                                </View>
                                <View style={{display: 'flex', flexDirection: "row", justifyContent: "space-between", marginTop: dp(38), alignItems: 'center'}}>
                                    <View style={{display: 'flex', flexDirection: "column"}}>
                                        <Text style={{ fontWeight: "600", fontSize: dp(10) }}>ИТОГО</Text>
                                        <Text style={{ fontWeight: "600", fontSize: dp(36), color: "#000" }}>{order.sum ? (order.sum - (order.sum * discount / 100) - usedPoints) : 0} ₽</Text>
                                    </View>
                                    <Button label='Оплатить' onClick={createOrder} color='blue' width={158} height={43} fontSize={18} fontWeight={"600"} />
                                </View>
                            </GHScrollView>
                    </>)}
            </BottomSheetScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: dp(22),
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: dp(24),
        fontWeight: '600',
        color: "#000"
    },
    text: {
        fontSize: dp(16),
        fontWeight: '400',
        color: "#000"
    },
    middle: {
        flex: 1,
        paddingLeft: dp(22),
        paddingRight: dp(22),
    },
    middleText: {
        fontSize: dp(36),
        fontWeight: "600"
    },
    boxes: {
        paddingTop: dp(81)
    },
    carImage: {
        width: dp(32),
        height: dp(32)
    },
    button: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        marginTop: dp(22)
    },
    paymentCard: {
        backgroundColor: "#F5F5F5",
        width: "100%",
        borderRadius: dp(25),
        padding: dp(25),
        marginTop: dp(25)
    },
    section: {
        fontSize: dp(20),
        fontWeight: '600',
        color: "#000"
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
        display: "flex",
        flexDirection: 'column'
      },
      cardAdd: {
        width: dp(105),
        height: dp(63),
        marginRight: 10,
        backgroundColor: '#FFFFFF',
        // padding: 16,
        padding: dp(5),
        borderRadius: 8,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center"
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: "#000"
      },
      cardDescription: {
        fontSize: 14,
        color: '#888',
      },
      logo: {
        maxWidth: dp(35),
        height: dp(26)
      },
      number: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems:'flex-end',
        color: "#000"
      },
      numberLabel: {
        fontWeight: "600",
        fontSize: dp(16),
        color: "#000"
      },
      addCardLabel: {
        color: "rgba(163, 163, 166, 1)",
        fontWeight: "600",
        fontSize: dp(12),
        paddingLeft: dp(4),
      },
      choice: {
        display: 'flex',
        flexDirection: "column"
      },
      inputContainer: {
        padding: 16
      },
        promoCodeTextInput: {
          backgroundColor: "rgba(216, 217, 221, 1)",
          borderRadius: moderateScale(25),
          alignSelf: "stretch",
          width: horizontalScale(200),
          height: verticalScale(35),
          fontSize: moderateScale(10),
          textAlign: "left",
          padding: 5,
          color: "#000000",
      }
})


export { Payment };
