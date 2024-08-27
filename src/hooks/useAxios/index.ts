import axios from 'axios';

import useStore from '../../state/store';

// Validators
import { isValidStorageData, hasAccessTokenCredentials } from '@context/AuthContext/index.validator';

interface IConfigObject {
    baseURL?: string;
    headers?: {
        'Authorization': string;
    };
}

const useAxios = (url: string) => {
    const switchUrl = (url: string) => {
        switch (url) {
            case 'CORE_URL':
                return 'http://213.189.201.57/api/v2';
            case 'USER_URL':
                return 'http://213.189.201.57/api/v2';
            default:
                return '';
        }
    }

    const { refreshToken, mutateRefreshToken, accessToken, expiredDate } = useStore()

    const refresh: () => Promise<string | null> = async () => {
        try {
            if (hasAccessTokenCredentials(refreshToken)) {
                const token = await mutateRefreshToken();

                return token;
            }
            
            return null
        } catch (error) {
          console.log(`Error: ${error}`)
        }

        return null;
    }

    let config: IConfigObject = {};

    if (url) {
        config.baseURL = switchUrl(url);
    }

    if (accessToken && expiredDate && isValidStorageData(accessToken, expiredDate)) {
        config.headers = {
            'Authorization': `Bearer ${accessToken}`
        }
    }

    const axiosInstance = axios.create(config);

    axiosInstance.interceptors.request.use(async req => {
        if (accessToken && expiredDate && !isValidStorageData(accessToken, expiredDate)) {
            const refToken = await refresh();

            if (refToken && req && req.headers) {
                req.headers['Authorization'] = `Bearer ${accessToken}`;
            }

            return req;
        };

        return req;
    })

    return axiosInstance;
}

export { useAxios };
