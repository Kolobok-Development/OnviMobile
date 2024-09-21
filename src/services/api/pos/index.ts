import {BusinessSuccessRequestPayload} from '../../../api/AppContent/types.ts';
import {appContent} from '../../../api/clients/AppContent';

enum POS {
  GET_POS_LIST = '/api/carwash',
}

export async function getPOSList(query: {
  [key: string]: string;
}): Promise<BusinessSuccessRequestPayload> {
  const response = await appContent.get<BusinessSuccessRequestPayload>(
    POS.GET_POS_LIST,
    {
      params: query,
    },
  );
  return response.data;
}
