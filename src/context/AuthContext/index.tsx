import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';

// Hooks
import {REGISTER, SEND_OTP, LOGIN, REFRESH} from '@mutations/auth';

import Toast from 'react-native-toast-message';

import {AUTH_URL, CORE_URL} from '@env';

// Secure Storage
import EncryptedStorage from 'react-native-encrypted-storage';

// Interfaces
import {
  IAuthContext,
  IEncryptedStorage,
  IAuthStore,
  IAuthStorePartial,
} from './index.interface';

// Validators
import {isValidStorageData, hasAccessTokenCredentials} from './index.validator';

import Loader from '@components/Loader';

const AuthContext = createContext<IAuthContext | null>(null);

import axios from 'axios';

const AuthProvider: React.FC<any> = ({children}: {children: ReactNode}) => {
  const [store, setStore] = useState<IAuthStore>({
    accessToken: null,
    phone: null,
    balance: null,
    loading: true,
    expiredDate: null,
    name: null,
    id: null,
  });

  const updateStore = (partialNewState: IAuthStorePartial) => {
    console.log('partial: ', partialNewState);
    const newState = {...store, ...partialNewState};
    console.log('~~~~~~~~~~~~~~~~~~~~~~');
    console.log({newState: newState});
    setStore(newState);
  };

  // loadStorageData on mount of the application
  useEffect(() => {
    async function loadStorageData() {
      try {
        const encryptedStorage: string | null = await EncryptedStorage.getItem(
          'user_session',
        );

        console.log('encryptedStorage: ', encryptedStorage);

        if (encryptedStorage) {
          const formatted: IEncryptedStorage = await JSON.parse(
            encryptedStorage as string,
          );

          if (formatted) {
            if (
              isValidStorageData(formatted.accessToken, formatted.expiredDate)
            ) {
              console.log('formatted: ', formatted);
              updateStore({
                accessToken: formatted.accessToken,
                loading: false,
                expiredDate: formatted.expiredDate,
                phone: formatted.phone,
                balance: formatted.balance,
                email: formatted.email,
                name: formatted.name,
                id: formatted.id,
              });
              return;
            }

            // if has refresh token -> refresh
            if (hasAccessTokenCredentials(formatted.refreshToken)) {
              await refreshToken(formatted);
              return;
            }
          }
        }

        updateStore({
          loading: false,
        });
      } catch (error) {
        console.log('LoadStorageData Error: ', error);
      }
    }

    loadStorageData();
  }, []);

  //  Использовать для axios реквестов!
  const refreshTokenFromSecureStorage = async () => {
    try {
      const encryptedStorage: string | null = await EncryptedStorage.getItem(
        'user_session',
      );

      if (encryptedStorage) {
        const formatted: IEncryptedStorage = await JSON.parse(
          encryptedStorage as string,
        );

        if (formatted && formatted.refreshToken) {
          await refreshToken(formatted);
        }
      }
    } catch (error) {
      console.log('LoadStorageData Error: ', error);
    }

    return;
  };

  const refreshToken: (formatted: any) => Promise<string | null> = async (
    formatted?: any,
  ) => {
    try {
      if (formatted.refreshToken) {
        const response: any = await axios
          .post(AUTH_URL + REFRESH, {refreshToken: formatted.refreshToken})
          .then(data => {
            return data.data;
          })
          .catch(async () => {
            await EncryptedStorage.removeItem('user_session');
            await updateStore({
              loading: false,
            });
            return null;
          });

        if (response) {
          await EncryptedStorage.setItem(
            'user_session',
            JSON.stringify({
              refreshToken: formatted.refreshToken,
              accessToken: response.data.accessToken,
              expiredDate: new Date(response.data.accessTokenExp).toISOString(),
              devNomer: formatted.devNomer,
              nomer: formatted.nomer,
              phone: formatted.phone,
              email: formatted.email,
              balance: formatted.balance,
              name: formatted.name,
              id: formatted.id,
            }),
          );

          await updateStore({
            accessToken: response.data.accessToken,
            expiredDate: response.data.accessTokenExp,
            loading: false,
            balance: formatted.balance,
            name: formatted.name,
            email: formatted.email,
            id: formatted.id,
          });

          return null;
        } else {
          updateStore({
            loading: false,
          });
        }
      }
    } catch (error) {
      updateStore({
        loading: false,
      });
    }

    return null;
  };

  //  Send SMS code to the phone number
  const sendOtp = (phone: string) => {
    const formatted = phone
      .replace(/[ ]+/g, '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');

    console.log({
      phone: formatted,
    });

    axios
      .post(AUTH_URL + SEND_OTP, {
        phone: formatted,
      })
      .then(data => {
        console.log(data);
        Toast.show({
          type: 'customSuccessToast',
          text1: 'Cообщение было отправлено',
        });
        return data.data;
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        Toast.show({
          type: 'customErrorToast',
          text1: 'Не получилось отправить СМС сообщение.',
        });
      });
  };

  const login = async (phone: string, otp: string) => {
    try {
      const formatted = phone
        .replace(/[ ]+/g, '')
        .replace('(', '')
        .replace(')', '')
        .replace('-', '');

      const response: any = await axios
        .post(AUTH_URL + LOGIN, {otp: otp, phone: formatted})
        .then(data => {
          return data.data;
        })
        .catch(error => {
          console.log('Error: ', error);
          JSON.stringify(error);
          Toast.show({
            type: 'customErrorToast',
            text1: 'Не получилось зайти в приложение!',
          });
        });
      if (response.data.type === 'login-success') {
        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            refreshToken: response.data.tokens.refreshToken,
            accessToken: response.data.tokens.accessToken,
            expiredDate: new Date(
              response.data.tokens.accessTokenExp,
            ).toISOString(),
            unqNumber: response.data.client.cards.unqNumber,
            number: response.data.client.cards.number,
            phone: response.data.client.phone,
            email: response.data.client.email,
            balance: response.data.client.cards.balance,
            name: response.data.client.name,
            id: response.data.client.id,
          }),
        );
        updateStore({
          phone: response.data.client.phone,
          email: response.data.client.email,
          balance: response.data.client.cards.balance,
          accessToken: response.data.tokens.accessToken,
          expiredDate: new Date(
            response.data.tokens.accessTokenExp,
          ).toISOString(),
          name: response.data.client.name,
          id: response.data.client.id,
        });
      }

      console.log('GET ME RESPONSE_____');
      console.log(response.data);
      return response.data.type;
    } catch (err) {
      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось зайти в приложение!',
        props: {errorCode: 400},
      });
      return null;
    }
  };

  const register = async (
    otp: string,
    phone: string,
    isTermsAccepted: boolean = true,
    isPromoTermsAccepted: boolean = true,
  ) => {
    try {
      const formatted = phone
        .replace(/[ ]+/g, '')
        .replace('(', '')
        .replace(')', '')
        .replace('-', '');

      const result = await axios
        .post(AUTH_URL + REGISTER, {
          phone: formatted,
          otp: otp,
          isTermsAccepted: isTermsAccepted,
          isPromoTermsAccepted: isPromoTermsAccepted,
        })
        .then(data => {
          console.log(data);
          return data;
        })
        .catch(err => {
          console.log(err);
          Toast.show({
            type: 'customErrorToast',
            text1: 'Не получилось зарегистрироваться!',
          });
        });

      if (
        result &&
        result.data &&
        result.data.data &&
        result.data.data.type &&
        result.data.data.type === 'register-success'
      ) {
        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            refreshToken: result.data.data.tokens.refreshToken,
            accessToken: result.data.data.tokens.accessToken,
            expiredDate: new Date(
              result.data.data.tokens.accessTokenExp,
            ).toISOString(),
            unqNumber: result.data.data.client.cards.unqNumber,
            phone: result.data.data.client.phone,
            email: result.data.data.client.email,
            balance: result.data.data.client.cards.balance,
            name: result.data.data.client.name,
            id: result.data.data.client.id,
          }),
        );

        updateStore({
          phone: result.data.data.client.phone,
          email: result.data.data.client.email,
          balance: result.data.data.client.cards.balance,
          accessToken: result.data.data.tokens.accessToken,
          expiredDate: new Date(
            result.data.data.tokens.accessTokenExp,
          ).toISOString(),
          name: result.data.data.client.name,
          id: result.data.data.client.id,
        });
      } else {
        Toast.show({
          type: 'customErrorToast',
          text1: 'Не получилось зарегистрироваться!',
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось зарегистрироваться!',
      });
      return null;
    }
  };

  async function getMe() {
    console.log(CORE_URL + '/account/me');
    try {
      const response = await axios.get(CORE_URL + '/account/me', {
        headers: {
          Authorization: `Bearer ${store.accessToken}`,
        },
      });

      if (response.data.data) {
        await EncryptedStorage.setItem(
          'user_session',
          JSON.stringify({
            phone: response.data.data.phone,
            email: response.data.data.email,
            balance: response.data.data.cards.balance,
            name: response.data.data.name,
          }),
        );

        updateStore({
          phone: response.data.data.phone,
          email: response.data.data.email,
          balance: response.data.data.cards.balance,
          name: response.data.data.name,
        });

        console.log('GET ME RESPONSE_____');
        console.log(response.data.data);
      }
    } catch (e: any) {
      console.log(e);
    }
  }

  //  Sign Out
  async function signOut() {
    try {
      await EncryptedStorage.removeItem('user_session');

      updateStore({
        phone: null,
        email: null,
        balance: null,
        accessToken: null,
        expiredDate: null,
        name: null,
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (store.loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        store: store,
        refreshToken: refreshToken,
        signOut: signOut,
        sendOtp: sendOtp,
        getMe: getMe,
        register: register,
        login: login,
        refreshTokenFromSecureStorage: refreshTokenFromSecureStorage,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export {AuthContext, AuthProvider, useAuth};
