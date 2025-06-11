import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
} from 'react-native';
import { navigateBottomSheet } from '@navigators/BottomSheetStack';
import { dp } from '../../utils/dp';
import { useTheme } from '@context/ThemeProvider';
import useStore from '../../state/store';
import BalancePlaceholder from './BalancePlaceholder';
import useWebSocket from '@hooks/useWebSocket';

interface BalanceProps {
  bottomSheetIndex: number;
}

const Balance = ({ bottomSheetIndex }: BalanceProps) => {
  const { theme } = useTheme();
  const {
    user,
    bottomSheetRef,
    bottomSheetSnapPoints,
    setUserBalance,
    accessToken,
  } = useStore();

  const socket = useWebSocket('https://kolobok-development-onvi-mobile-188a.twc1.net', accessToken);

  useEffect(() => {
    if (!socket) return;

    socket.emit('request_balance');
    console.log('Запрос на обновление баланса отправлен');

    const onBalanceUpdate = (data: number) => {
      console.log('Получено обновление баланса:', data);
      setUserBalance(data);
    };

    socket.on('balance_update', onBalanceUpdate);

    return () => {
      socket.off('balance_update', onBalanceUpdate);
      console.log('Слушатель balance_update очищен');
    };
  }, [setUserBalance]);

  // const { message, connected, requestBalance } = useSocket(socketUrl, accessToken);

  // useEffect(() => {
  //   if (connected) {
  //     console.log('💥 WebSocket connected, requesting balance...');
  //     requestBalance();
  //   }
  // }, [connected, requestBalance]);

  // useEffect(() => {
  //   if (message) {
  //     console.log('💥 Received balance update:', message);

  //     let balance = null;

  //     if (message.balance !== undefined) {
  //       balance = message.balance;
  //     } 
  //     else if (message.data?.balance !== undefined) {
  //       balance = message.data.balance;
  //     }
  //     else if (message.cardBalance !== undefined) {
  //       balance = message.cardBalance;
  //     }

  //     if (balance !== null) {
  //       setUserBalance(balance);
  //     } else {
  //       console.error('Received message does not contain balance:', message);
  //     }
  //   }
  // }, [message, setUserBalance]);

  return (
    <>
      {!user || !user.cards ? (
        <BalancePlaceholder bottomSheetIndex={bottomSheetIndex} />
      ) : (
        <View
          style={[
            styles.container,
            Platform.OS === 'android' && styles.androidShadow,
            Platform.OS === 'ios' && styles.iosShadow,
          ]}>
          <TouchableOpacity
            style={{
              ...styles.button,
              display: bottomSheetIndex > 2 ? 'none' : 'flex',
              backgroundColor: theme.mainColor,
            }}
            onPress={() => {
              navigateBottomSheet('History', {});
              bottomSheetRef?.current?.snapToPosition(
                bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
              );
            }}>
            <Image
              source={require('../../assets/icons/small-icon.png')}
              style={{ width: dp(30), height: dp(30) }}
            />
            <Text style={{ ...styles.balance, color: theme.textColor }}>
              {user.cards.balance}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    height: dp(40),
    position: 'absolute',
    top: dp(10),
    paddingLeft: dp(6),
    paddingRight: dp(6),
    marginLeft: dp(4),
    marginRight: dp(4),
    right: dp(10),
    borderRadius: 45,
    padding: dp(5),
    shadowColor: '#494949',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  balance: {
    color: '#FFFFFF',
    fontSize: dp(18),
    paddingRight: dp(5),
    fontWeight: '600',
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    position: 'relative',
    flexDirection: 'row',
  },
  androidShadow: {
    elevation: 4,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export { Balance };
