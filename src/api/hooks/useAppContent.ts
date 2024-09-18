import {
  getCampaign,
  getCampaigns,
  getCarWashes,
  getNewsPost,
  getNewsPosts,
  getPartner,
  getPartners,
} from '../AppContent/appContent';

import useSWR from 'swr';

// Define a fetcher function for useSWR
const fetcher = (fn: Function, ...args: any[]) => fn(...args);

function usePartner(id: number) {
  const { data, error, isLoading } = useSWR(id ? ['partner', id] : null, fetcher.bind(null, getPartner, id));
  return { data, error, isLoading: isLoading };
}

function usePartners() {
  const { data, error, isLoading } = useSWR('partner', fetcher.bind(null, getPartners));
  return { data, error, isLoading: isLoading };
}

function useCampaign(id: number) {
  const { data, error, isLoading } = useSWR(id ? ['campaign', id] : null, fetcher.bind(null, getCampaign, id));
  return { data, error, isLoading: isLoading };
}

function useCampaigns() {
  const { data, error, isLoading } = useSWR('campaign', fetcher.bind(null, getCampaigns));
  return { data, error, isLoading: isLoading };
}

function useBusiness(query: {[key: string]: string}, enabled?: boolean) {
  const { data, isLoading, error, mutate } = useSWR(enabled ? ['business', query] : null, fetcher.bind(null, getCarWashes, query));
  return { data, error, isLoading: isLoading, mutate };
}

function useNewsPosts() {
  const { data, error, isLoading } = useSWR('news', fetcher.bind(null, getNewsPosts));
  return { data, error, isLoading: isLoading };
}

function useNewsPost(id: number) {
  const { data, error, isLoading } = useSWR(id ? ['news', id] : null, fetcher.bind(null, getNewsPost, id));
  return { data, error, isLoading: isLoading };
}

export {
  usePartner,
  usePartners,
  useCampaigns,
  useCampaign,
  useBusiness,
  useNewsPosts,
  useNewsPost,
};
