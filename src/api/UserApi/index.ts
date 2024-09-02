import axios from 'axios';

import useStore from '../../state/store';

const { accessToken } = useStore()

const authApi = axios.create({
  baseURL: 'https://api.onvione.ru/api/v2',
});

authApi.defaults.headers.common['access-token'] = accessToken;

export {authApi};
