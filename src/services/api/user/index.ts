import {IUser} from '../../../types/models/User.ts';
import {userApiInstance} from '../../../api/axiosConfig.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {IGetTariffResponse} from '../../../types/api/user/res/IGetTariffResponse.ts';
import {IGetAccountHistoryRequestParams} from '../../../types/api/user/req/IGetAccountHistoryRequestParams.ts';
import {IGetHistoryResponse} from '../../../types/api/user/res/IGetHistoryResponse.ts';
import {IGetPromoHistoryResponse} from '../../../types/api/user/res/IGetPromoHistoryResponse.ts';
import {IUpdateAccountRequest} from '../../../types/api/user/req/IUpdateAccountRequest.ts';
import {IUpdateAccountResponse} from '../../../types/api/user/res/IUpdateAccountResponse.ts';

enum ACCOUNT {
  GET_MET_URL = '/account/me',
  GET_ORDER_HISTORY_URL = '/account/orders',
  GET_TARIFF_URL = '/account/tariff',
  GET_PROMOTION_HISTORY_URL = '/account/promotion',
  UPDATE_ACCOUNT_URL = '/account',
}

export async function getMe(): Promise<IUser> {
  const response = await userApiInstance.get<IUserApiResponse<IUser>>(
    ACCOUNT.GET_MET_URL,
  );
  return response.data.data;
}

export async function getTariff(): Promise<IGetTariffResponse> {
  const response = await userApiInstance.get<
    IUserApiResponse<IGetTariffResponse>
  >(ACCOUNT.GET_TARIFF_URL);

  return response.data.data;
}

export async function getOrderHistory(
  params: IGetAccountHistoryRequestParams,
): Promise<IGetHistoryResponse[]> {
  const response = await userApiInstance.get<
    IUserApiResponse<IGetHistoryResponse[]>
  >(ACCOUNT.GET_ORDER_HISTORY_URL, {params});

  return response.data.data;
}

export async function getCampaignHistory(): Promise<
  IGetPromoHistoryResponse[]
> {
  const response = await userApiInstance.get<
    IUserApiResponse<IGetPromoHistoryResponse[]>
  >(ACCOUNT.GET_PROMOTION_HISTORY_URL);
  return response.data.data;
}

export async function update(body: IUpdateAccountRequest): Promise<number> {
  const response = await userApiInstance.patch<
    IUserApiResponse<IUpdateAccountResponse>
  >(ACCOUNT.UPDATE_ACCOUNT_URL, body);

  return response.status;
}

export async function deleteAccount(): Promise<number> {
  const response = await userApiInstance.delete(ACCOUNT.UPDATE_ACCOUNT_URL);
  console.log(JSON.stringify(response, null, 2));
  return response.status;
}
