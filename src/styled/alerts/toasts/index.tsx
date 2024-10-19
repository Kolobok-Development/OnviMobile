import React from 'react';

import {ToastConfig, ToastConfigParams} from 'react-native-toast-message';
import {Text, View} from 'react-native';

export const toastConfig: ToastConfig = {
  customBaseToast: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        height: 65,
        width: '90%',
        backgroundColor: '#FFF',
        borderRadius: 38,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: '500',
          color: '#000000',
        }}>
        {text1}
      </Text>
    </View>
  ),
  customSuccessToast: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        height: 50,
        width: '90%',
        backgroundColor: '#BFFA00',
        borderRadius: 38,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: '500',
          color: '#000000',
        }}>
        👍 {text1}
      </Text>
    </View>
  ),
  customErrorToast: ({text1, props}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        minHeight: 50,
        width: '90%',
        backgroundColor: 'rgba(250, 2, 2, 0.60)',
        borderRadius: 38,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: '500',
          color: '#FFF',
        }}>
        🥲 {text1}
      </Text>
      {props.errorCode && (
        <Text
          style={{
            paddingLeft: 32,
            paddingTop: 2,
            fontSize: 12,
            fontWeight: '600',
            color: '#FFF',
            textDecorationLine: 'underline',
          }}>
          Код ошибки {props.errorCode}
        </Text>
      )}
    </View>
  ),
  customInfoToast: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        display: 'flex',
        minHeight: 50,
        width: '90%',
        backgroundColor: '#0B68E1',
        borderRadius: 38,
        paddingHorizontal: 15,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          paddingLeft: 5,
          fontSize: 15,
          fontWeight: '500',
          color: '#FFF',
        }}>
        🙂{text1}
      </Text>
    </View>
  ),
};
