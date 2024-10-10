import {ICreateOrderRequest} from '../../../types/api/order/req/ICreateOrderRequest.ts';
import {ICreateOrderResponse} from '../../../types/api/order/res/ICreateOrderResponse.ts';
import {userApiInstance} from '../../../api/axiosConfig.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {IValidatePromoCodeRequest} from '../../../types/api/order/req/IValidatePromoCodeRequest.ts';
import {IValidatePromoCodeResponse} from '../../../types/api/order/res/IValidatePromoCodeResponse.ts';
import {IPingPosRequestParams} from '../../../types/api/order/req/IPingPosRequestParams.ts';
import {IPingPosResponse} from '../../../types/api/order/res/IPingPosResponse.ts';

enum ORDER {
  CREATE_ORDER_URL = '/order/create',
  VALIDATE_PROMOCODE_URL = '/order/promo/validate',
  PING_POS_URL = '/order/ping',
}

export async function create(
  body: ICreateOrderRequest,
): Promise<ICreateOrderResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<ICreateOrderResponse>
  >(ORDER.CREATE_ORDER_URL, body);

  return response.data.data;
}
export async function validatePromoCode(
  body: IValidatePromoCodeRequest,
): Promise<IValidatePromoCodeResponse> {
  const response = await userApiInstance.post<
    IUserApiResponse<IValidatePromoCodeResponse>
  >(ORDER.VALIDATE_PROMOCODE_URL, body);
  return response.data.data;
}
export async function pingPos(
  params: IPingPosRequestParams,
): Promise<IPingPosResponse> {
  const response = await userApiInstance.get<
    IUserApiResponse<IPingPosResponse>
  >(ORDER.PING_POS_URL, {params});
  return response.data.data;
}
