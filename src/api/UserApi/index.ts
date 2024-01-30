import axios from "axios";
import { useAuth } from '@context/AuthContext';

import { CORE_URL } from '@env';
console.log("lol")

const authContext: any = useAuth();

const authApi = axios.create({
  baseURL: CORE_URL,
});

authApi.defaults.headers.common['access-token'] = authContext?.accessToken;

export { authApi };