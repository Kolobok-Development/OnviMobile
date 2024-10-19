import {IApplyPromotionRequest} from '../../../types/api/promotion/req/IApplyPromotionRequest.ts';
import {IApplyPromotionResponse} from '../../../types/api/promotion/res/IApplyPromotionResponse.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {userApiInstance} from '@services/api/axiosConfig.ts';

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
