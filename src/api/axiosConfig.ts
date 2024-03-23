import axios from 'axios';
import {API_URL, STRAPI_URL} from '@env';
import {useAuth} from '@context/AuthContext';

const authContext: any = useAuth();

const userApiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
userApiInstance.defaults.headers.common['access-token'] =
  authContext?.accessToken;

const contentApiInstance = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {userApiInstance, contentApiInstance};
