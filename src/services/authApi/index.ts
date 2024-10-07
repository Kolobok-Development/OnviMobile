import axios from 'axios';

import {AUTH_URL} from '@env';

const authApi = axios.create({
  baseURL: AUTH_URL,
});

export {authApi};
