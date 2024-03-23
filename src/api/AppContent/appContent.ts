import {
  BusinessSuccessRequestPayload,
  CampaignsSuccessRequestPayload,
  CampaignSuccessRequestPayload,
  NewsPostsSuccessRequestPayload,
  NewsPostSuccessRequestPayload,
  PartnersSuccessRequestPayload,
  PartnerSuccessRequestPayload,
} from './types';
import {appContent} from '../clients/AppContent';

export async function getPartners() {
  try {
    const response = await appContent.get<PartnersSuccessRequestPayload>(
      'api/partners?populate=*',
    );

    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.error('getPartners - Error: ', JSON.stringify(error));
  }
}

export async function getPartner(id: number) {
  try {
    const response = await appContent.get<PartnerSuccessRequestPayload>(
      `api/partners/${id}?populate=*`,
    );

    return response.data;
  } catch (error: any) {
    console.error('getPartner - Error: ', JSON.stringify(error));
  }
}

export async function getCampaigns() {
  try {
    const response = await appContent.get<CampaignsSuccessRequestPayload>(
      'api/sampaigns?populate=*',
    );

    return response.data;
  } catch (error: any) {
    console.error('getCampaign - Error: ', JSON.stringify(error));
  }
}

export async function getCampaign(id: number) {
  try {
    const response = await appContent.get<CampaignSuccessRequestPayload>(
      `api/sampaigns/${id}?populate=*`,
    );

    return response.data;
  } catch (error: any) {
    console.error('getCampaigns - Error: ', JSON.stringify(error));
  }
}

export async function getCarWashes(query: {[key: string]: string}) {
  try {
    console.log(
      'QUERY TO SEND ___________________***************_________________',
    );
    const response = await appContent.get<BusinessSuccessRequestPayload>(
      'api/carwash',
      {
        params: query,
      },
    );

    console.log(
      'RESPONSE DATA ___________________***************_________________',
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error('getCampaigns - Error: ', JSON.stringify(error));
  }
}

export async function getNewsPosts() {
  try {
    const response = await appContent.get<NewsPostsSuccessRequestPayload>(
      'api/posts?populate=*',
    );

    return response.data;
  } catch (error: any) {
    console.error('getCampaigns - Error: ', JSON.stringify(error));
  }
}

export async function getNewsPost(id: number) {
  try {
    const response = await appContent.get<NewsPostSuccessRequestPayload>(
      `api/posts/${id}?populate=*`,
    );
    return response.data;
  } catch (error: any) {
    console.error('getCampaigns - Error: ', JSON.stringify(error));
  }
}
