import {useMutation, useQuery} from '@tanstack/react-query';
import {
  getCampaignHistory,
  getMe,
  getOrderHistory,
  getTariff,
  update,
} from '../user';
import {IUser} from '../../types/models/User';
import {AxiosError} from 'axios';
import {IGetTariffResponse} from '../../types/api/user/res/IGetTariffResponse';
import {IGetHistoryResponse} from '../../types/api/user/res/IGetHistoryResponse';
import {IGetAccountHistoryRequestParams} from '../../types/api/user/req/IGetAccountHistoryRequestParams';
import {IGetPromoHistoryResponse} from '../../types/api/user/res/IGetPromoHistoryResponse';
import {IUpdateAccountRequest} from '../../types/api/user/req/IUpdateAccountRequest';

function useGetMe() {
  return useQuery<IUser, AxiosError>({
    queryKey: ['me'],
    queryFn: () => {
      return getMe();
    },
  });
}

function useGetTariff() {
  return useQuery<IGetTariffResponse, AxiosError>({
    queryKey: ['tariff'],
    queryFn: () => {
      return getTariff();
    },
  });
}

function useGetOrderHistory(params: IGetAccountHistoryRequestParams) {
  return useQuery<IGetHistoryResponse[], AxiosError>({
    queryKey: ['order-hist'],
    queryFn: () => {
      return getOrderHistory(params);
    },
  });
}

function useGetCampaignHistory() {
  return useQuery<IGetPromoHistoryResponse[], AxiosError>({
    queryKey: ['campaign-hist'],
    queryFn: () => {
      return getCampaignHistory();
    },
  });
}

function useUpdateUser(data: IUpdateAccountRequest) {
  return useMutation<number, AxiosError>({
    mutationFn: () => {
      return update(data);
    },
  });
}

export {
  useGetMe,
  useGetTariff,
  useGetOrderHistory,
  useGetCampaignHistory,
  useUpdateUser,
};
