import {IUser} from '../../types/models/User';
import {StoreSlice} from '../store.ts';

import {ILoginResponse} from '../../types/api/auth/res/ILoginResponse';
import {IRegisterResponse} from '../../types/api/auth/res/IRegisterResponse';

import LocalStorage from '@services/local-storage';

import {sendOtp, login, register, refresh} from '../../api/auth/index';
import {getMe, getTariff} from '../../api/user';
import Toast from 'react-native-toast-message';

import {
  isValidStorageData,
  hasAccessTokenCredentials,
} from '@context/AuthContext/index.validator';
import EncryptedStorage from 'react-native-encrypted-storage';

export interface UserSlice {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  expiredDate: string | null;
  loading: boolean;
  setUser: (user: IUser | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setExpiredDate: (expiredDate: string | null) => void;
  setLoading: (loading: boolean) => void;
  mutateRefreshToken: () => Promise<string | null>;
  login: (phone: string, otp: string) => Promise<ILoginResponse | null>;
  register: (
    otp: string,
    phone: string,
    isTermsAccepted?: boolean,
    isPromoTermsAccepted?: boolean,
  ) => Promise<IRegisterResponse | null>;
  sendOtp: (phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const createUserSlice: StoreSlice<UserSlice> = (set, get) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  expiredDate: null,
  loading: true,

  setUser: user => set({user}),
  setAccessToken: accessToken => set({accessToken}),
  setExpiredDate: expiredDate => set({expiredDate}),
  setLoading: loading => set({loading}),

  mutateRefreshToken: async () => {
    try {
      const existingSession = await EncryptedStorage.getItem('user_session');
      let existingData: Record<string, any> = {};
      if (existingSession) {
        existingData = JSON.parse(existingSession);
      }
      if (existingData.refreshToken) {
        const response = await refresh({
          refreshToken: existingData.refreshToken,
        });
        if (response) {
          await LocalStorage.set(
            'user_session',
            JSON.stringify({
              accessToken: response.accessToken,
              expiredDate: new Date(response.accessTokenExp).toISOString(),
            }),
          );
          set({
            accessToken: response.accessToken,
            expiredDate: new Date(response.accessTokenExp).toISOString(),
            loading: false,
          });
          await get().loadUser();
        }
      } else {
        return null;
      }

      return existingData.refreshToken;
    } catch (error) {
      console.log('Error refreshing token:', error);
      set({loading: false});

      return null;
    }
  },

  login: async (phone, otp) => {
    try {
      const formattedPhone = phone.replace(/[ \(\)-]+/g, '');
      const response = await login({phone: formattedPhone, otp});

      if (response.type === 'register-required') {
        return response;
      }

      if (response.type === 'login-success') {
        const {tokens} = response;
        if (!tokens) {
          return null;
        }

        const refreshToken = tokens.refreshToken;

        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            refreshToken: refreshToken,
          }),
        );

        await LocalStorage.set(
          'user_session',
          JSON.stringify({
            accessToken: tokens.accessToken,
            expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          }),
        );
        set({
          accessToken: tokens.accessToken,
          expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          isAuthenticated: true,
          loading: false,
        });
        await get().loadUser();

        return response;
      }

      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось зайти в приложение!',
        props: {errorCode: 400},
      });
      return response;
    } catch (error) {
      console.log('Login error:', error);
      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось зайти в приложение!',
        props: {errorCode: 400},
      });
      return null;
    }
  },

  register: async (
    otp,
    phone,
    isTermsAccepted = true,
    isPromoTermsAccepted = true,
  ) => {
    try {
      const formattedPhone = phone.replace(/[ \(\)-]+/g, '');
      const response = await register({
        phone: formattedPhone,
        otp,
        isTermsAccepted,
        isPromoTermsAccepted,
      });

      if (response.type === 'register-success') {
        const {tokens} = response;

        const refreshToken = tokens.refreshToken;

        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            refreshToken: refreshToken,
          }),
        );

        await LocalStorage.set(
          'user_session',
          JSON.stringify({
            accessToken: tokens.accessToken,
            expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          }),
        );
        set({
          accessToken: tokens.accessToken,
          expiredDate: new Date(tokens.accessTokenExp).toISOString(),
          isAuthenticated: true,
          loading: false,
        });
        await get().loadUser();

        return response;
      }

      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось зарегистрироваться!',
        props: {errorCode: 400},
      });
      return response;
    } catch (error) {
      console.log('Registration error:', error);

      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось зарегистрироваться!',
        props: {errorCode: 400},
      });
      return null;
    }
  },

  sendOtp: async phone => {
    try {
      const formattedPhone = phone.replace(/[ \(\)-]+/g, '');
      await sendOtp({phone: formattedPhone})
        .then(data => {
          Toast.show({
            type: 'customSuccessToast',
            text1: 'Cообщение было отправлено',
          });
          return data;
        })
        .catch((err: unknown) => {
          console.log(JSON.stringify(err, null, 2));
          Toast.show({
            type: 'customErrorToast',
            text1: 'Не получилось отправить СМС сообщение.',
          });
        });
    } catch (error) {
      console.log('Send OTP error:', error);
    }
  },

  signOut: async () => {
    try {
      await LocalStorage.delete('user_session');

      await EncryptedStorage.setItem(
        'user_session',
        JSON.stringify({
          refreshToken: null,
        }),
      );

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        expiredDate: null,
      });
    } catch (error) {
      console.log('Sign out error:', error);
    }
  },

  loadUser: async () => {
    try {
      const userSession = await LocalStorage.getString('user_session');

      const existingSession = await EncryptedStorage.getItem('user_session');

      let existingData: Record<string, any> = {};
      if (existingSession) {
        existingData = JSON.parse(existingSession);
      }

      if (userSession) {
        const formatted: Record<string, any> = JSON.parse(userSession);
        if (
          formatted &&
          isValidStorageData(formatted.accessToken, formatted.expiredDate)
        ) {
          set({
            accessToken: formatted.accessToken,
            expiredDate: formatted.expiredDate,
            isAuthenticated: true,
            loading: false,
          });

          const data = await getMe();
          const tariff = await getTariff();

          set({
            user: {
              ...data,
              tariff: tariff.cashBack,
            },
          });
        } else if (
          formatted &&
          hasAccessTokenCredentials(existingData.refreshToken)
        ) {
          console.log('I am trying to refresh token!');
          await get().mutateRefreshToken();
        } else {
          set({loading: false});
        }
      } else {
        set({loading: false});
      }
    } catch (error) {
      console.log('Load user error:', error);
    }
  },
});

export default createUserSlice;
