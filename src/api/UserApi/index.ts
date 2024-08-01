import axios from 'axios';
import {useAuth} from '@context/AuthContext';

import {CORE_URL} from '@env';

const authContext: any = useAuth();

const authApi = axios.create({
  baseURL: 'https://api.onvione.ru/api/v2',
});

authApi.defaults.headers.common['access-token'] = authContext?.accessToken;

export {authApi};
