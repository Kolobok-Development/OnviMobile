import {
  Partner,
  PartnersSuccessRequestPayload,
  PartnerSuccessRequestPayload,
} from '../../../types/api/app/types.ts';
import {
  contentApiInstance,
  userApiInstance,
} from '@services/api/axiosConfig.ts';

enum PARTNER {
  GET_PARTNER_LIST = 'api/partners',
  GET_PARTNER_BY_ID = 'api/partners',
  GET_GAZPROM_AUTH_TOKEN = '/partner/2921/activate',
  GET_GAZPROM_AUTH_TOKEN_FROM_REFERENCE = '/partner/2921/reference',
}

export async function getPartners(
  populate: Record<string, any> | '*' = {},
): Promise<Partner[]> {
  const params: Record<string, any> = {};

  if (populate === '*') {
    // If user wants to populate everything
    params.populate = '*';
  } else {
    // Dynamically add specific populate fields
    for (const [key, value] of Object.entries(populate)) {
      params[`populate[${key}]`] = value;
    }
  }

  const response = await contentApiInstance.get<PartnersSuccessRequestPayload>(
    PARTNER.GET_PARTNER_LIST,
    {params}, // Axios will handle the query string
  );

  return response.data.data;
}

export async function getPartner(
  id: number,
  populate: Record<string, any> | '*' = {},
): Promise<Partner> {
  const params: Record<string, any> = {};

  if (populate === '*') {
    // If user wants to populate everything
    params.populate = '*';
  } else {
    // Dynamically add specific populate fields
    for (const [key, value] of Object.entries(populate)) {
      params[`populate[${key}]`] = value;
    }
  }

  const response = await contentApiInstance.get<PartnerSuccessRequestPayload>(
    `${PARTNER.GET_PARTNER_BY_ID}/${id}`, // Construct the URL with the ID
    {params}, // Axios will handle the query string
  );

  return response.data.data;
}

export async function getGazpromAuthToken(): Promise<any> {
  console.log('MAKING API CALL');
  const response = await userApiInstance.post(PARTNER.GET_GAZPROM_AUTH_TOKEN);
  return response.data.data;
}

interface IGazpromReferencePayload {
  reference: string;
};

interface IGazpromResponseData {
  token: string;
};

export async function getGazpromAuthTokenFromReference(body: IGazpromReferencePayload): Promise<IGazpromResponseData> {
  console.log('MAKING API CALL');
  const response = await userApiInstance.post(
    PARTNER.GET_GAZPROM_AUTH_TOKEN_FROM_REFERENCE,
    body,
  );

  return response.data.data;
}