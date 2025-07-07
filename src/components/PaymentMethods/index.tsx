import React from 'react';
import {
  ImageSourcePropType,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import {scale} from 'react-native-size-matters';
import PaymentMethodButton, {
  PaymentMethodType,
} from '@styled/buttons/PaymentMethodButton';

interface PaymentMethod {
  id: PaymentMethodType;
  label: string;
  icon: ImageSourcePropType;
}

interface PaymentMethodsProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'BANK_CARD',
      label: 'Банковская карта', // From your image
      icon: require('../../assets/icons/bank_card.png'), // Update path as needed
    },
    {
      id: 'SBP',
      label: 'СБП',
      icon: require('../../assets/icons/sbp_icon.png'), // Update path as needed
    },
    {
      id: 'SBERBANK',
      label: 'Cбер Pay',
      icon: require('../../assets/icons/sber_pay_icon.png'), // Update path as needed
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Способ оплаты</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PaymentMethodButton
            icon={item.icon}
            label={item.label}
            selected={selectedMethod === item.id}
            onPress={() => onSelectMethod(item.id)}
            style={styles.methodButton}
          />
        )}
        initialNumToRender={4}    
        maxToRenderPerBatch={4}   
        windowSize={5}            
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: dp(15),
  },
  sectionTitle: {
    fontSize: dp(16),
    fontWeight: '600',
    marginBottom: dp(12),
    color: '#000',
  },
  methodButton: {
    width: scale(85),
    marginRight: dp(12),
    marginBottom: dp(10)
  },
});

export default PaymentMethods;