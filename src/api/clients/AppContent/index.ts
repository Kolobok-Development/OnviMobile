import {STRAPI_URL} from '@env';
import axios from 'axios';

const appContent = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export {appContent};
