import axios from "axios";
import useStore from "../../state/store";

import { CORE_URL } from '@env';

const { accessToken } = useStore()

const coreApi = axios.create({
  baseURL: CORE_URL,
});

coreApi.defaults.headers.common['access-token'] = accessToken;

export { coreApi };