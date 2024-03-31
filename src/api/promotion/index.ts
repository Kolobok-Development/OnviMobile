import {IApplyPromotionRequest} from '../../types/api/promotion/req/IApplyPromotionRequest';
import {IApplyPromotionResponse} from '../../types/api/promotion/res/IApplyPromotionResponse';
import {userApiInstance} from '../axiosConfig';
import {IUserApiResponse} from '../../types/api/common/IUserApiResponse';

enum PROMOTION {
  APPLY_URL = '/promotion/apply',
}
export async function apply(
  body: IApplyPromotionRequest,
): Promise<IApplyPromotionResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IApplyPromotionResponse>
  >(PROMOTION.APPLY_URL, body);

  return response.data.data;
}
