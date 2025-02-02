import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {dp} from '@utils/dp';
import {BackButton} from '@components/BackButton';
import React, {useEffect, useState} from 'react';
import {Button} from '@styled/buttons/Button';
import {useNavigation} from '@react-navigation/core';
import useSWRMutation from 'swr/mutation';
import {apply} from '@services/api/promotion';
import {IApplyPromotionRequest} from '../../types/api/promotion/req/IApplyPromotionRequest.ts';
import Toast from 'react-native-toast-message';

import {
  DrawerParamList,
  GeneralDrawerNavigationProp,
} from 'src/types/DrawerNavigation';
import {PersonalPromoBanner} from '@styled/banners/PersonalPromoBanner';
import {RouteProp, useRoute} from '@react-navigation/native';
import {Copy} from 'react-native-feather';
import Clipboard from '@react-native-clipboard/clipboard';

type PromoInputRouteProp = RouteProp<DrawerParamList, 'Ввод Промокода'>;

const PromosInput = () => {
  const [code, setCode] = useState('');
  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'Ввод Промокода'>>();

  const route = useRoute<PromoInputRouteProp>();
  const {promocode, type} = route.params;

  const {trigger, isMutating} = useSWRMutation(
    'applyUserPromo',
    (key, {arg}: {arg: IApplyPromotionRequest}) => apply(arg),
    {
      onError: err => {
        let message = 'Произошла ошибка, повторите попытку чуть позже.';
        setCode(''); // Clear the code input

        if (err.response && err.response.data) {
          const errorCode = parseInt(err.response.data.code);
          switch (errorCode) {
            case 84:
              message =
                'Промокод недействителен. Пожалуйста, проверьте и попробуйте снова.';
              break;
            case 88:
              message = 'К сожалению, данный промокод истек.';
              break;
            default:
              message = 'Произошла ошибка, повторите попытку чуть позже.';
          }
        }

        Toast.show({
          type: 'customErrorToast',
          text1: message,
        });
      },
      onSuccess: () =>
        Toast.show({
          type: 'customSuccessToast',
          text1: 'Промокод успешно применен',
        }),
    },
  );

  const [promoCode, setPromocode] = useState('');
  const [color, setColor] = useState('#000000');

  const copyToClipboard = () => {
    Clipboard.setString(promoCode);
  };

  useEffect(() => {
    setPromocode(promocode.code);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackButton
              callback={() => {
                navigation.navigate('Промокоды');
              }}
            />
            <Text style={styles.screenTitle}>Промокод</Text>
            <View style={{width: dp(50)}} />
          </View>
          <View style={styles.content}>
            {type == 'personal' &&
            'discount' in promocode &&
            'discountType' in promocode ? (
              <PersonalPromoBanner
                title={`Промокод на ${promocode.discount} ${
                  promocode.discountType == 2 ? '%' : 'баллов'
                }`}
                date={new Date(promocode.expiryDate)}
                disable={true}
              />
            ) : (
              <View
                style={{width: '100%', height: '60%', borderRadius: dp(25)}}>
                {promocode.image && (
                  <Image
                    source={{uri: promocode.image}}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </View>
            )}
            {type == 'personal' ? (
              <View style={styles.promoCodeSection}>
                <Text style={styles.title}>Промокод</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.promoCode}>{promocode.code}</Text>
                  <Pressable
                    onPress={copyToClipboard}
                    style={{marginLeft: dp(10)}}>
                    <Copy
                      stroke={color}
                      width={dp(22)}
                      height={dp(22)}
                      onPressIn={() => {
                        setColor('#AAA7A7FF');
                      }}
                      onPressOut={() => {
                        setColor('#000000');
                      }}
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <></>
            )}
            <Text style={styles.title}>Описание</Text>
            <Text style={styles.text}>
              {type === 'personal'
                ? promocode.image
                : 'description' in promocode
                ? promocode.description
                : ''}
            </Text>
          </View>
          {type == 'global' && (
            <View style={{alignSelf: 'center'}}>
              <Button
                label={'Активировать'}
                color={'blue'}
                showLoading={isMutating}
                onClick={() => trigger({code: promoCode})}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    color: '#000',
    letterSpacing: 0.2,
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginTop: dp(30),
    alignItems: 'center',
  },
  action: {
    width: '85%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: dp(30),
    justifyContent: 'space-between',
  },
  promoCodeSection: {
    flexDirection: 'column',
    width: '100%',
  },
  title: {
    fontSize: dp(14),
    fontWeight: '600',
    marginTop: dp(30),
    marginBottom: dp(10),
    alignSelf: 'flex-start',
  },
  promoCode: {
    fontSize: dp(18),
    fontWeight: '700',
    color: '#3461FF',
  },
  text: {
    fontSize: dp(14),
    letterSpacing: 1.5,
  },
});

export {PromosInput};
