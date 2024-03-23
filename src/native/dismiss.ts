import {NativeModules} from 'react-native';

const RnYookassa = NativeModules.YooKassaPaymentGateway;

const dismiss = (): void => {
  RnYookassa.dismiss();
};

export {dismiss};
