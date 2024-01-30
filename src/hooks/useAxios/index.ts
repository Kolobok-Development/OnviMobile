import axios from 'axios';

import { CORE_URL, USER_URL } from '@env';

import { useAuth } from '@context/AuthContext';
console.log("lol")

// Validators
import { isValidStorageData, hasAccessTokenCredentials } from '@context/AuthContext/index.validator';

// Secure Storage
import EncryptedStorage from 'react-native-encrypted-storage';

// Interfaces
import { IAuthContext, IEncryptedStorage } from '@context/AuthContext/index.interface';

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
                return CORE_URL;
            case 'USER_URL':
                return USER_URL;
            default:
                return '';
        }
    }

    const { store, refreshToken } = useAuth() as IAuthContext;

    const refresh: () => Promise<string | null> = async () => {
        try {
          const encryptedStorage: string | null = await EncryptedStorage.getItem("user_session");
    
          if (encryptedStorage) {
            const formatted: IEncryptedStorage = await JSON.parse(encryptedStorage as string);
    
            if (formatted) {
              if (hasAccessTokenCredentials(formatted.refreshToken)) {
                const token = await refreshToken(formatted); 
    
                return token;
              }
            }
          }
        } catch (error) {
          console.log(`Error: ${error}`)
        }
    
        return null;
    }

    let config: IConfigObject = {};

    if (url) {
        config.baseURL = switchUrl(url);
    }

    let accessToken = store.accessToken ? store.accessToken : null;
    let expiredDate = store.expiredDate ? store.expiredDate : null;

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