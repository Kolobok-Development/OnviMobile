import {useMutation, useQuery} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {IGetAccountHistoryRequestParams} from '../../types/api/user/req/IGetAccountHistoryRequestParams';
import {IUpdateAccountRequest} from '../../types/api/user/req/IUpdateAccountRequest';
import {
  getCampaignHistory,
  getMe,
  getOrderHistory,
  getTariff,
  update,
} from '../user/index';
import Toast from "react-native-toast-message";

function useGetMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => {
      return getMe();
    },
  });
}

function useGetTariff() {
  return useQuery({
    queryKey: ['tariff'],
    queryFn: () => {
      return getTariff();
    },
  });
}

function useGetOrderHistory(params: IGetAccountHistoryRequestParams) {
  return useQuery({
    queryKey: ['order-hist'],
    queryFn: () => {
      return getOrderHistory(params);
    },
  });
}

function useGetCampaignHistory() {
  return useQuery({
    queryKey: ['campaign-hist'],
    queryFn: () => {
      return getCampaignHistory();
    },
  });
}

function useUpdateUser() {
  return useMutation({
    mutationFn: (data: IUpdateAccountRequest) => {
      return update(data);
    },
    onError: () => {
      Toast.show({
        type: 'customErrorToast',
        text1: 'Призошла ощибка повторите попытку чуть позже',
      });
    },
    onSuccess: () => {
      Toast.show({
        type: 'customSuccessToast',
        text1: 'Данные успешно сохраненны ',
      });
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
