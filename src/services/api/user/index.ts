import {IUser, Meta} from '../../../types/models/User.ts';
import {IUserApiResponse} from '../../../types/api/common/IUserApiResponse.ts';
import {IGetTariffResponse} from '../../../types/api/user/res/IGetTariffResponse.ts';
import {IGetAccountHistoryRequestParams} from '../../../types/api/user/req/IGetAccountHistoryRequestParams.ts';
import {IGetHistoryResponse} from '../../../types/api/user/res/IGetHistoryResponse.ts';
import {IGetPromoHistoryResponse} from '../../../types/api/user/res/IGetPromoHistoryResponse.ts';
import {IUpdateAccountRequest} from '../../../types/api/user/req/IUpdateAccountRequest.ts';
import {IUpdateAccountResponse} from '../../../types/api/user/res/IUpdateAccountResponse.ts';
import {userApiInstance} from '@services/api/axiosConfig.ts';
import {ICreateUserMetaRequest} from '../../../types/api/user/req/ICreateUserMetaRequest.ts';
import {IUpdateUserMetaRequest} from '../../../types/api/user/req/IUpdateUserMetaRequest.ts';
import {IPersonalPromotion} from '../../../types/models/PersonalPromotion.ts';

enum ACCOUNT {
  GET_MET_URL = '/1/me',
  GET_ORDER_HISTORY_URL = '/account/orders',
  GET_TARIFF_URL = '/account/tariff',
  GET_PROMOTION_HISTORY_URL = '/account/promotion',
  GET_ACTIVE_PROMOTIONS = 'account/activePromotion',
  UPDATE_ACCOUNT_URL = '/account',
  UPDATE_NOTIFICATION_URL = '/account/notifications',
  CREATE_ACCOUNT_META = '/account/meta/create',
  UPDATE_ACCOUNT_META = '/account/meta/update',
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

export async function updateAllowNotificationSending(
  notification: boolean,
): Promise<void> {
  await userApiInstance.patch(ACCOUNT.UPDATE_NOTIFICATION_URL, {notification});
}

export async function getActiveClientPromotions(): Promise<
  IPersonalPromotion[]
> {
  const response = await userApiInstance.get<
    IUserApiResponse<IPersonalPromotion[]>
  >(ACCOUNT.GET_ACTIVE_PROMOTIONS);

  return response.data.data;
}

export async function createUserMeta(data: Meta): Promise<any> {
  const body: ICreateUserMetaRequest = {
    clientId: data.clientId,
    deviceId: data.deviceId,
    model: data.model,
    name: data.name,
    platform: data.platform,
    platformVersion: data.platformVersion,
    manufacturer: data.manufacturer,
    appToken: data.appToken,
  };
  const response = await userApiInstance.post(
    ACCOUNT.CREATE_ACCOUNT_META,
    body,
  );
  return response;
}

export async function updateUserMeta(data: Meta): Promise<any> {
  const body: IUpdateUserMetaRequest = {
    ...data,
  };
  const response = await userApiInstance.post(
    ACCOUNT.UPDATE_ACCOUNT_META,
    body,
  );
  //console.log(JSON.stringify(response, null, 2));
  return response;
}

export async function deleteAccount(): Promise<number> {
  const response = await userApiInstance.delete(ACCOUNT.UPDATE_ACCOUNT_URL);
  console.log(JSON.stringify(response, null, 2));
  return response.status;
}
