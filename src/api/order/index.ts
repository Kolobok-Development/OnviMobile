import {ICreateOrderResponse} from '../../types/api/order/res/ICreateOrderResponse';
import {ICreateOrderRequest} from '../../types/api/order/req/ICreateOrderRequest';
import {userApiInstance} from '../axiosConfig';
import {IUserApiResponse} from '../../types/api/common/IUserApiResponse';
import {IValidatePromoCodeRequest} from '../../types/api/order/req/IValidatePromoCodeRequest';
import {IValidatePromoCodeResponse} from '../../types/api/order/res/IValidatePromoCodeResponse';
import {IPingPosRequestParams} from '../../types/api/order/req/IPingPosRequestParams';
import {IPingPosResponse} from '../../types/api/order/res/IPingPosResponse';

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
  console.log(response);
  return response.data.data;
}
