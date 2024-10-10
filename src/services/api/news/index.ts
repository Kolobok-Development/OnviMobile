import {appContent} from '../../../api/clients/AppContent';
import {
  NewsPost,
  NewsPostsSuccessRequestPayload,
  NewsPostSuccessRequestPayload,
} from '../../../api/AppContent/types.ts';

enum NEWS {
  GET_NEWS_LIST = 'api/posts',
  GET_NEWS_BY_ID = 'api/posts',
}

export async function getNewsList(
  populate: Record<string, any> | '*' = {},
): Promise<NewsPost[]> {
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

  const response = await appContent.get<NewsPostsSuccessRequestPayload>(
    NEWS.GET_NEWS_LIST,
    {params},
  );

  return response.data.data;
}

export async function getNewsById(
  id: number,
  populate: Record<string, any> | '*' = {},
): Promise<NewsPost> {
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

  const response = await appContent.get<NewsPostSuccessRequestPayload>(
    NEWS.GET_NEWS_BY_ID + `/${id}`,
    {params},
  );

  return response.data.data;
}
