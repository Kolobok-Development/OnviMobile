import {useMutation} from '@tanstack/react-query';
import {IApplyPromotionRequest} from '../../types/api/promotion/req/IApplyPromotionRequest';
import {apply} from '../promotion/index';
import Toast from 'react-native-toast-message';

function useApplyPromotion() {
  return useMutation({
    mutationFn: (data: IApplyPromotionRequest) => {
      return apply(data);
    },
    onError: () => {
      Toast.show({
        type: 'customErrorToast',
        text1: 'Призошла ощибка повторите попытку чуть позже',
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
