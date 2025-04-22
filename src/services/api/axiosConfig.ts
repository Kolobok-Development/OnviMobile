import axios, {InternalAxiosRequestConfig} from 'axios';
const PREFIX = '/api/v2/';

import Config from 'react-native-config';
import {setupAuthInterceptors} from './interceptors';

// Create API instances
const userApiInstance = axios.create({
  baseURL:
    'https://d5dujs53ub9l7pfufoct.aqkd4clz.apigw.yandexcloud.net' + PREFIX,
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
  baseURL: 'https://onvi-mobile-app-api-kqeql.ondigitalocean.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export {userApiInstance, contentApiInstance};
