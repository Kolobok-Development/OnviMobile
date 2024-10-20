import axios, {InternalAxiosRequestConfig} from 'axios';
import {STRAPI_URL} from '@env';
const PREFIX = '/api/v2/';

import {isValidStorageData} from '@services/validation/index.validator.ts';
import {getToken} from '../../state/store.ts';

const userApiInstance = axios.create({
  baseURL: 'https://d5dvl4vdjmsgsmscobdi.apigw.yandexcloud.net' + PREFIX,
  withCredentials: true,
});

const _retriveConfigWithAuthorization = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  console.log('retrieve config with authorization: ', config);
  try {
    const accessToken = getToken().accessToken;
    const expiredDate = getToken().expiredDate;

    if (
      accessToken &&
      expiredDate &&
      isValidStorageData(accessToken, expiredDate)
    ) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch (e) {
    console.log(e);
  }

  return config;
};

const getConfigWithHeaders = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  config.headers['Content-Type'] = 'application/json';
  config.headers.Accept = 'application/json';
  config.headers['Access-Control-Allow-Origin'] = '*';
  return _retriveConfigWithAuthorization(config);
};

userApiInstance.interceptors.request.use(
  config => getConfigWithHeaders(config),
  error => {
    return Promise.reject(error);
  },
);
const contentApiInstance = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {userApiInstance, contentApiInstance};
