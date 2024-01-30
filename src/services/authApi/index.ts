import axios from 'axios';

import { AUTH_URL } from '@env';
console.log("lol")

const authApi = axios.create({
  baseURL: AUTH_URL,
});

export { authApi };