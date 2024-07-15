import {useMutation} from '@tanstack/react-query';
import {IValidatePromoCodeRequest} from '../../types/api/order/req/IValidatePromoCodeRequest.ts';
import {validatePromoCode} from '../order';
import Toast from 'react-native-toast-message';
import {IValidatePromoCodeResponse} from '../../types/api/order/res/IValidatePromoCodeResponse.ts';

function useValidatePromoCode() {
  return useMutation({
    mutationFn: (data: IValidatePromoCodeRequest) => {
      return validatePromoCode(data);
    },
    onError: error => {
      Toast.show({
        type: 'customErrorToast',
        text1: 'Не удалось применить промокод',
      });
      console.log(JSON.stringify(error, null, 2));
    },
    onSuccess: (response: IValidatePromoCodeResponse) => {
      Toast.show({
        type: 'customSuccessToast',
        text1: 'Промокод успешно применен',
      });
      return response;
    },
  });
}

export {useValidatePromoCode};
