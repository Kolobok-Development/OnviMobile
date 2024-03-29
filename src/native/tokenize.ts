import {NativeModules} from 'react-native';
import {PaymentConfig} from '../types/PaymentConfig';
import {TokenizationResult} from '../types/TokenizationResult';
import {ErrorResult} from '../types/ErrorResult';

const RnYookassa = NativeModules.YooKassaPaymentGateway;

const tokenize = (params: PaymentConfig): Promise<TokenizationResult> => {
  return new Promise((resolve, reject) => {
    RnYookassa.startTokenize(
      params,
      (result?: TokenizationResult, error?: ErrorResult) => {
        if (result) {
          resolve(result);
        } else {
          if (error) {
            console.log('ERROR TOKENEZATION');
            console.log(error);
            reject({code: error.code, message: error.message});
          } else {
            reject(new Error('Unknown error occurred during tokenization.'));
          }
        }
      },
    );
  });
};

export {tokenize};
