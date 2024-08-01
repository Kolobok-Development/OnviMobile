import {useMutation} from '@tanstack/react-query';
import {IApplyPromotionRequest} from '../../types/api/promotion/req/IApplyPromotionRequest';
import {apply} from '../promotion/index';
import Toast from 'react-native-toast-message';

function useApplyPromotion() {
  return useMutation({
    mutationFn: (data: IApplyPromotionRequest) => {
      return apply(data);
    },
    onError: error => {
      const errorResponse = error.response?.data;
      let message = 'Призошла ощибка повторите попытку чуть позже';

      switch (parseInt(errorResponse.code)) {
        case 84:
          message =
            'Промокод недействителен. Пожалуйста, проверьте и попробуйте снова.';
          break;
        case 88:
          message = 'К сожалению данный промокод истек.';
          break;
        default:
          message = 'Призошла ошибка, повторите попытку чуть позже.';
      }

      Toast.show({
        type: 'customErrorToast',
        text1: message,
      });
    },
    onSuccess: () => {
      Toast.show({
        type: 'customSuccessToast',
        text1: 'Промокод успешно применен',
      });
    },
  });
}

export {useApplyPromotion};
