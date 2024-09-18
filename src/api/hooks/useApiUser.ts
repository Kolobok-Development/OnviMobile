import useSWR from 'swr';
import { IGetAccountHistoryRequestParams } from '../../types/api/user/req/IGetAccountHistoryRequestParams';
import {
  getCampaignHistory,
  getMe,
  getOrderHistory,
  getTariff,
  update,
} from '../user/index';
import Toast from "react-native-toast-message";

const fetcher = (fn: Function, ...args: any[]) => fn(...args);

function useGetMe() {
  const { data, error, isLoading } = useSWR<ReturnType<typeof getMe>>('me', fetcher.bind(null, getMe));
  return { data, error, isLoading: isLoading };
}

function useGetTariff() {
  const { data, error, isLoading } = useSWR<ReturnType<typeof getTariff>>('tariff', fetcher.bind(null, getTariff));
  return { data, error, isLoading: isLoading };
}

function useGetOrderHistory(params: IGetAccountHistoryRequestParams) {
  const { data, error, mutate, isLoading } = useSWR<ReturnType<typeof getOrderHistory>>(params ? ['order-hist', params] : null, fetcher.bind(null, getOrderHistory, params));

  console.log("history: ", {
    data, error
  })

  return { data, error, isLoading: isLoading, mutate };
}

function useGetCampaignHistory() {
  const { data, error, mutate, isLoading } = useSWR<ReturnType<typeof getCampaignHistory>>('campaign-hist', fetcher.bind(null, getCampaignHistory));
  return { data, error, isLoading: isLoading, mutate };
}

function useUpdateUser() {
  const { mutate, isLoading, error } = useSWR<ReturnType<typeof update>>('update-user', update, {
    onError: (err) => {
      console.log("USER UPDATE ERROR: ", err)
      Toast.show({
        type: 'customErrorToast',
        text1: 'Призошла ошибка, повторите попытку чуть позже',
      });
    },
    onSuccess: () => {
      Toast.show({
        type: 'customSuccessToast',
        text1: 'Данные успешно сохранены',
      });
    },
  });

  return { mutate: mutate, isLoading, error };
}

export {
  useGetMe,
  useGetTariff,
  useGetOrderHistory,
  useGetCampaignHistory,
  useUpdateUser,
};