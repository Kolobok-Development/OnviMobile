import {userApiInstance} from '../axiosConfig';
import {IUser} from '../../types/models/User';
import {IUserApiResponse} from '../../types/api/common/IUserApiResponse';
import {IGetTariffResponse} from '../../types/api/user/res/IGetTariffResponse';
import {IGetAccountHistoryRequestParams} from '../../types/api/user/req/IGetAccountHistoryRequestParams';
import {IGetHistoryResponse} from '../../types/api/user/res/IGetHistoryResponse';
import {IGetPromoHistoryResponse} from '../../types/api/user/res/IGetPromoHistoryResponse';
import {IUpdateAccountRequest} from '../../types/api/user/req/IUpdateAccountRequest';
import {IUpdateAccountResponse} from '../../types/api/user/res/IUpdateAccountResponse';

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
