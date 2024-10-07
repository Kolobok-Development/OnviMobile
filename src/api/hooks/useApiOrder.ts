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
      const errorResponse = (error as any).response?.data;
      let message = 'Призошла ощибка повторите попытку чуть позже';
      switch (parseInt(errorResponse.code)) {
        case 8:
          message =
            'Промокод недействителен. Пожалуйста, проверьте и попробуйте снова.';
          break;
        default:
          message = 'Призошла ошибка, повторите попытку чуть позже.';
      }

      Toast.show({
        type: 'customErrorToast',
        text1: message,
      });
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
