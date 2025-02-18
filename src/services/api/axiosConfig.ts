import axios, {InternalAxiosRequestConfig} from 'axios';
const PREFIX = '/api/v2/';

import {isValidStorageData} from '@services/validation/index.validator.ts';
import {getToken} from '../../state/store.ts';
import Config from 'react-native-config';

const userApiInstance = axios.create({
  baseURL: Config.API_URL + PREFIX,
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
  baseURL: Config.STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {userApiInstance, contentApiInstance};
