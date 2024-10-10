import {appContent} from '../../../api/clients/AppContent';
import {
  Partner,
  PartnersSuccessRequestPayload,
  PartnerSuccessRequestPayload,
} from '../../../api/AppContent/types.ts';

enum PARTNER {
  GET_PARTNER_LIST = 'api/partners',
  GET_PARTNER_BY_ID = 'api/partners',
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

  const response = await appContent.get<PartnersSuccessRequestPayload>(
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

  const response = await appContent.get<PartnerSuccessRequestPayload>(
    `${PARTNER.GET_PARTNER_BY_ID}/${id}`, // Construct the URL with the ID
    {params}, // Axios will handle the query string
  );

  return response.data.data;
}
