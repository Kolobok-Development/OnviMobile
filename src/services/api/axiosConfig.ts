import axios, {InternalAxiosRequestConfig} from 'axios';
const PREFIX = '/api/v2/';

import Config from 'react-native-config';
import {setupAuthInterceptors} from './interceptors';

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

export {userApiInstance, contentApiInstance};
