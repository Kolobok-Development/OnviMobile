import {
  Platform,
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
import {useApplyPromotion} from '../../api/hooks/useApiPromotion';
import useSWRMutation from 'swr/mutation';
import {apply} from '@services/api/promotion';
import {IApplyPromotionRequest} from '../../types/api/promotion/req/IApplyPromotionRequest.ts';
import Toast from 'react-native-toast-message';

import {GeneralDrawerNavigationProp} from 'src/types/DrawerNavigation';

const PromosInput = () => {
  const [code, setCode] = useState('');
  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'Ввод Промокода'>>();

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

  const clearInput = () => {
    setCode('');
  };

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
            <TextInput
              placeholder="Введите промокод"
              maxLength={19}
              value={code}
              onChangeText={setCode}
              style={{
                backgroundColor: 'rgba(245, 245, 245, 1)',
                borderRadius: dp(25),
                width: '100%',
                height: dp(40),
                textAlign: 'left',
                fontSize: dp(16),
                color: '#000000',
                paddingLeft: dp(20),
              }}
            />
            <View style={styles.action}>
              <Button
                label={'Очистить'}
                color={'lightGrey'}
                fontSize={dp(16)}
                height={dp(45)}
                width={dp(125)}
                onClick={() => clearInput()}
              />
              <Button
                label={'Применить'}
                color={'blue'}
                showLoading={isMutating}
                fontSize={dp(16)}
                height={dp(45)}
                width={dp(125)}
                onClick={() => trigger({code})}
              />
            </View>
          </View>
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
});

export {PromosInput};
