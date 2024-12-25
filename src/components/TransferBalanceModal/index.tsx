import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

// utils
import {dp} from '@utils/dp';

import useStore from '../../state/store';

export default function TransferBalanceModal() {
  const {transferBalanceModalVisible, toggleTransferBalanceModal} =
    useStore.getState();

  const [cardNumber, setCardNumber] = useState('');
  const [balance, setBalance] = useState<number>();
  const [error, setError] = useState('');

  // Function to format the card number
  const formatCardNumber = (text: string) => {
    setError('');
    const digits = text.replace(/\D/g, '');
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1-');
    setCardNumber(formatted);
  };

  // Function to simulate balance fetch (for error handling purposes)
  const findBalance = async () => {
    try {
      throw new Error('Карта не найдена');
      setError('');
      setBalance(300);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // BottomSheet snap points
  const snapPoints = useMemo(() => ['50%'], []);

  return (
    <BottomSheet
      index={transferBalanceModalVisible ? 0 : -1} // Show when visible is true, hidden otherwise
      snapPoints={snapPoints}
      onChange={index => {
        console.log('CHAAAAAAAAAAAAANGE: ', typeof index);
        if (index == -1) toggleTransferBalanceModal(false);
      }}
      enablePanDownToClose={true} // Enable swipe down to close functionality
    >
      <View style={[styles.modalContainer]}>
        {/* Drag Handle (optional: to show as a draggable bar) */}
        <View style={styles.topBar} />

        {/* Scrollable Modal Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.modalTitle}>Перенос баланса</Text>
          {!balance ? (
            <>
              <Text style={styles.modalDescription}>
                Средства будут перенесены из приложения «Мой-Ка!ДС» в приложение
                «ONVI».
              </Text>
              <Text style={styles.modalDescription}>
                Введите номер карты лояльности приложения «Мой-Ка!ДС».
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.modalDescription}>
                Карта найдена, можем осуществить перенос бонусов в приложение
                «ONVI».
              </Text>
            </>
          )}

          <ImageBackground
            source={require('../../assets/images/balance-transfer-input.png')}
            style={styles.background}
            resizeMode="cover">
            <View style={styles.overlay}>
              <View style={styles.container}>
                <TextInput
                  style={[styles.input, {color: error ? 'red' : 'black'}]}
                  value={cardNumber}
                  onChangeText={formatCardNumber}
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  keyboardType="numeric"
                  maxLength={19}
                  placeholderTextColor="#999"
                  editable={balance ? false : true}
                />
                {balance ? (
                  <Text style={styles.balanceText}>{balance} бонусов</Text>
                ) : null}
                {error ? (
                  <Text style={styles.errorText}>Карта не найдена</Text>
                ) : null}
              </View>
            </View>
          </ImageBackground>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: cardNumber.length < 19 ? '#A3A3A6' : '#3461FF',
              },
            ]}
            disabled={cardNumber.length < 19}
            onPress={() => findBalance()}>
            <Text style={styles.buttonText}>Найти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
    zIndex: 999999999999999999999999999999,
  },
  topBar: {
    width: 60,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginTop: dp(10),
    borderRadius: 10,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: dp(20),
    paddingBottom: dp(20),
  },

  modalTitle: {
    fontSize: dp(24),
    fontWeight: '600',
  },

  modalDescription: {
    fontSize: dp(16),
    marginTop: dp(8),
  },

  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    aspectRatio: 342 / 118,
    marginTop: dp(10),
  },

  overlay: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 10,
  },

  container: {
    position: 'absolute',
    bottom: 0,
    padding: dp(10),
    width: '70%',
  },

  input: {
    width: '90%',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: dp(15),
    fontWeight: '700',
  },

  balanceText: {
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: dp(18),
    fontWeight: '600',
  },

  errorText: {
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: dp(14),
    color: 'red',
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
});
