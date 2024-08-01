import useSWR from 'swr';
import {getPOSList} from '@services/api/pos';

export function usePos(query: {[key: string]: string}) {
  return useSWR(['getPOSList', query], () => getPOSList(query), {
    onError: error => {
      console.error(error);
    },
    onSuccess: data => {
      return data;
    },

  });
}
