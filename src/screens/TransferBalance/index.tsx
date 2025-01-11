import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  TextInput,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import {dp} from '../../utils/dp';

import {BackButton} from '@components/BackButton';
import {useNavigation} from '@react-navigation/core';

import {GeneralDrawerNavigationProp} from 'src/types/DrawerNavigation';

import {getBalance} from '@services/api/balance';
import {transferBalance} from '@services/api/balance';

type FindBalanceResponse = {
  balance: number;
  balanceAfterTransfer: number;
  bonusAsPromo: number;
};

const TransferBalance = () => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [balance, setBalance] = useState<FindBalanceResponse>();
  const [error, setError] = useState<string>('');

  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'Перенести баланс'>>();

  const formatCardNumber = (text: string) => {
    setError('');
    const digits = text.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1-');
    setCardNumber(formatted);
  };

  const findBalance = async () => {
    setError('');

    getBalance({
      devNomer: cardNumber,
    })
      .then(data => {
        setBalance({
          balance: data.data.airBalance + data.data.realBalance,
          balanceAfterTransfer: data.data.realBalance,
          bonusAsPromo: data.data.airBalance,
        });
      })
      .catch(err => {
        setError(err.message);
        setBalance(undefined);
      });
  };

  const transfer = async () => {
    transferBalance({
      devNomer: cardNumber,
      airBalance: balance?.bonusAsPromo ?? 0,
      realBalance: balance?.balanceAfterTransfer ?? 0,
    })
      .then(data => {})
      .catch(err => {});
  };

  const isCardNumberValid = cardNumber.length === 19;
  const buttonStyles = [
    styles.button,
    {backgroundColor: isCardNumberValid ? '#3461FF' : '#A3A3A6'},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton
          callback={() => {
            navigation.navigate('Настройки');
          }}
        />
        <Text style={styles.screenTitle}>Перенос Баланса</Text>
        <View style={{width: dp(50)}} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.modalTitle}>Перенос баланса</Text>
        <Text style={styles.modalDescription}>
          {!balance
            ? 'Средства будут перенесены из приложения «Мой-Ка!ДС» в приложение «ONVI».\n \nВведите номер карты лояльности приложения «Мой-Ка!ДС».'
            : 'Карта найдена, можем осуществить перенос бонусов в приложение «ONVI».'}
        </Text>

        <View style={styles.cardInputContainer}>
          <ImageBackground
            source={require('../../assets/images/balance-transfer-input.png')}
            style={styles.imageBackground}
            resizeMode="cover">
            <View style={styles.overlay}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, error ? {color: 'red'} : undefined]}
                  value={cardNumber}
                  onChangeText={formatCardNumber}
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  keyboardType="numeric"
                  maxLength={19}
                  placeholderTextColor="#999"
                  editable={balance ? false : true}
                />
                {balance ? (
                  <Text style={{...styles.balanceText, marginTop: 0}}>
                    {balance?.balance} бонусов
                  </Text>
                ) : (
                  <></>
                )}
                {error ? <Text style={styles.errorText}>{error}</Text> : <></>}
              </View>
            </View>
          </ImageBackground>
        </View>

        {balance ? (
          <>
            <View style={styles.cardInputContainer}>
              <ImageBackground
                source={require('../../assets/images/transfer-balance-success.png')}
                style={styles.imageBackground}
                resizeMode="cover">
                <View style={styles.overlay}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.balanceText}>
                      Баланс после переноса {'\n'}
                      {balance?.balanceAfterTransfer} бонусов
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
            <Text
              style={{
                marginTop: dp(10),
              }}>
              💡 {balance?.bonusAsPromo} бонусов вернутся в виде промокода. Его
              можно будет найти в разделе{' '}
              <Pressable
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    color: 'blue',
                    textDecorationLine: 'underline',
                  }}>
                  Промокоды
                </Text>
              </Pressable>
            </Text>
          </>
        ) : (
          <></>
        )}

        {!balance ? (
          <TouchableOpacity
            style={buttonStyles}
            disabled={!isCardNumberValid}
            onPress={findBalance}>
            <Text style={styles.buttonText}>Найти</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={buttonStyles} onPress={transfer}>
            <Text style={styles.buttonText}>Перенести</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: dp(20),
    paddingBottom: dp(20),
    paddingTop: dp(50),
  },
  modalTitle: {
    fontSize: dp(24),
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: dp(16),
    marginTop: dp(8),
  },
  cardInputContainer: {
    position: 'relative',
    marginTop: dp(10),
  },
  imageBackground: {
    width: '100%',
    aspectRatio: 342 / 118,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 10,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    padding: dp(10),
    width: '100%',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: dp(20),
    fontWeight: '700',
    color: 'black',
  },
  balanceText: {
    paddingLeft: dp(10),
    fontSize: dp(18),
    fontWeight: '600',
    marginTop: dp(10),
    color: 'black',
  },
  errorText: {
    paddingLeft: dp(10),
    fontSize: dp(14),
    color: 'red',
    marginTop: dp(5),
  },
  button: {
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp(10),
    marginBottom: dp(30),
  },
  buttonText: {
    fontSize: dp(18),
    fontWeight: '600',
    color: '#FFF',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(20),
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    letterSpacing: 0.2,
    color: '#000',
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
});

export {TransferBalance};
