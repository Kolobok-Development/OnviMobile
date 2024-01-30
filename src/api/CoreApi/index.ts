import axios from "axios";
import { useAuth } from '@context/AuthContext';

import { CORE_URL } from '@env';

const authContext: any = useAuth();
console.log("lol")

const coreApi = axios.create({
  baseURL: CORE_URL,
});

coreApi.defaults.headers.common['access-token'] = authContext?.accessToken;

export { coreApi };