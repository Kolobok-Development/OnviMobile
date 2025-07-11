import axios, {AxiosError} from 'axios';
const PREFIX = '/api/v2/';

import Config from 'react-native-config';
import {setupAuthInterceptors} from './interceptors';

import {DdLogs} from '@datadog/mobile-react-native';

function logAxiosErrorToDatadog(error: AxiosError, instanceName: string) {
  const logData = {
    message: error?.message || 'Axios error',
    url: error?.config?.url,
    method: error?.config?.method,
    status: error?.response?.status,
    instance: instanceName,
  };

  DdLogs.error('Axios Request Failed', logData);
  return Promise.reject(error);
}

// Create API instances
const userApiInstance = axios.create({
  baseURL: Config.API_URL + PREFIX,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// Setup auth interceptors for handling token expiry
setupAuthInterceptors(userApiInstance);

// Content API instance (without auth interceptors)
const contentApiInstance = axios.create({
  baseURL: Config.STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

contentApiInstance.interceptors.response.use(
  response => response,
  error => logAxiosErrorToDatadog(error, 'contentApiInstance'),
);

export {userApiInstance, contentApiInstance};
