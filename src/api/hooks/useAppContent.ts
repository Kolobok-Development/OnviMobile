import {
  getCampaign,
  getCampaigns,
  getCarWashes,
  getNewsPost,
  getNewsPosts,
  getPartner,
  getPartners,
} from '../AppContent/appContent';
import {useQuery} from '@tanstack/react-query';

function usePartner(id: number) {
  return useQuery({
    queryKey: ['partner', id],
    queryFn: () => {
      return getPartner(id);
    },
  });
}

function usePartners() {
  return useQuery({
    queryKey: ['partner'],
    queryFn: () => {
      return getPartners();
    },
  });
}

function useCampaign(id: number) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => {
      return getCampaign(id);
    },
  });
}

function useCampaigns() {
  return useQuery({
    queryKey: ['campaign'],
    queryFn: () => {
      return getCampaigns();
    },
  });
}
//query: {[key: string]: string}
function useBusiness(query: {[key: string]: string}, enabled: boolean) {
  return useQuery({
    queryKey: ['business'],
    queryFn: () => {
      return getCarWashes(query);
    },
    enabled: enabled,
  });
}

function useNewsPosts() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => {
      return getNewsPosts();
    },
  });
}

function useNewsPost(id: number) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => {
      return getNewsPost(id);
    },
  });
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
