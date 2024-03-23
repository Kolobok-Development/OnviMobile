import {ICreateOrderResponse} from '../../types/api/order/res/ICreateOrderResponse';
import {ICreateOrderRequest} from '../../types/api/order/req/ICreateOrderRequest';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {AxiosError} from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {IUserApiErrorResponse} from '../../types/api/common/IUserApiErrorResponse';
import {userApiInstance} from '../axiosConfig';
import {IUserApiResponse} from '../../types/api/common/IUserApiResponse';
import {IValidatePromoCodeRequest} from '../../types/api/order/req/IValidatePromoCodeRequest';
import {IValidatePromoCodeResponse} from '../../types/api/order/res/IValidatePromoCodeResponse';
import {IPingPosRequestParams} from '../../types/api/order/req/IPingPosRequestParams';
import {IPingPosResponse} from '../../types/api/order/res/IPingPosResponse';

enum ORDER {
  CREATE_ORDER_URL = '/create',
  VALIDATE_PROMOCODE_URL = '/promo/validate',
  PING_POS_URL = '/ping',
}

export async function create(
  body: ICreateOrderRequest,
): Promise<ICreateOrderResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<ICreateOrderResponse>
    >(ORDER.CREATE_ORDER_URL, body);

    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}
export async function validatePromoCode(
  body: IValidatePromoCodeRequest,
): Promise<IValidatePromoCodeResponse> {
  try {
    const response = await userApiInstance.post<
      IUserApiResponse<IValidatePromoCodeResponse>
    >(ORDER.VALIDATE_PROMOCODE_URL, body);
    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}
export async function pingPos(
  params: IPingPosRequestParams,
): Promise<IPingPosResponse> {
  try {
    const response = await userApiInstance.get<
      IUserApiResponse<IPingPosResponse>
    >(ORDER.PING_POS_URL, {params});

    return response.data.data;
  } catch (error: AxiosError<IUserApiErrorResponse>) {
    console.log(error);
  }
}
