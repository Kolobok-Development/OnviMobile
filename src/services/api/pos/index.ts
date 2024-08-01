import {BusinessSuccessRequestPayload} from '../../../api/AppContent/types.ts';
import {fetcher} from '@utils/fetcher.ts';

enum POS {
  GET_POS_LIST = '/api/carwash',
}

async function getPOSList(query: {
  [key: string]: string;
}): Promise<BusinessSuccessRequestPayload> {
  // Construct the URL with query parameters
  const queryParams = new URLSearchParams(query);
  const fullUrl = `${POS.GET_POS_LIST}?${queryParams.toString()}`;

  // Make the fetch request
  const response = await fetcher(
    fullUrl,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    'appApi',
  );

  return response;
}

export {getPOSList};
