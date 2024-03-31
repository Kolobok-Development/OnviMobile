import {useMutation} from '@tanstack/react-query';
import {IApplyPromotionRequest} from '../../types/api/promotion/req/IApplyPromotionRequest';
import { apply } from "../promotion";

function useApplyPromotion(data: IApplyPromotionRequest) {
  return useMutation({
    mutationFn: () => {
      return apply(data);
    },
  });
}


export {
  useApplyPromotion
}
