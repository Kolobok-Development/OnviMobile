import axios, {InternalAxiosRequestConfig} from 'axios';
import {API_URL, STRAPI_URL} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import {IEncryptedStorage} from '@context/AuthContext/index.interface';
const PREFIX = '/api/v2';

const userApiInstance = axios.create({
  baseURL: 'https://api.onvione.ru' + PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

const _retriveConfigWithAuthorization = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  try {
    const credentials: string | null = await EncryptedStorage.getItem(
      'user_session',
    );

    if (credentials !== null) {
      const formatted: IEncryptedStorage = await JSON.parse(
        credentials as string,
      );

      config.headers.Authorization = `Bearer ${formatted.accessToken}`;
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
