import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

// utils
import {isValidStorageData, hasAccessTokenCredentials} from './index.validator';

// components
import Loader from '@components/Loader';
import Toast from 'react-native-toast-message';

// types
import {IUser, IUserPartial} from '../../types/models/User';
import {IAuthTokens} from '../../types/models/AuthTokens';
import {IAuthStore, IAuthStorePartial, IAuthContext} from './index.interface';

// api
import {getMe, getTariff} from '../../api/user';
import {sendOtp, login, register, refresh} from '../../api/auth/index';

const AuthContext = createContext<IAuthContext | null>(null);

const saveUserSession = async (
  tokens: IAuthTokens | null,
  client: IUser | null,
) => {
  try {
    const existingSession = await EncryptedStorage.getItem('user_session');
    let existingData: Record<string, any> = {};
    if (existingSession) {
      existingData = JSON.parse(existingSession);
    }
    const newData = {
      refreshToken: tokens?.refreshToken || existingData.refreshToken,
      accessToken: tokens?.accessToken || existingData.accessToken,
      expiredDate: tokens?.accessTokenExp
        ? new Date(tokens?.accessTokenExp).toISOString()
        : existingData.expiredDate,
      unqNumber: client?.cards?.unqNumber || existingData.unqNumber,
    };

    console.log('new Data: ', newData);
    await EncryptedStorage.setItem('user_session', JSON.stringify(newData));
  } catch (error) {
    console.error('Error saving user session:', error);
  }
};

const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [store, setStore] = useState<IAuthStore>({
    accessToken: null,
    loading: true,
    expiredDate: null,
  });

  const [user, setUser] = useState<IUser>({
    id: null,
    name: null,
    phone: null,
    email: null,
    birthday: null,
    cards: null,
    avatar: 'both.jpg',
    balance: null,
    tariff: null,
  });

  const updateStore = (partialNewState: IAuthStorePartial) => {
    const newState = {...store, ...partialNewState};
    setStore(newState);
  };

  const updateUser = async (partialNewState: IUserPartial) => {
    if (partialNewState.avatar) {
      try {
        const existingSession = await EncryptedStorage.getItem('user_session');
        let existingData: Record<string, any> = {};
        if (existingSession) {
          existingData = JSON.parse(existingSession);
        }
        const newData = {
          ...existingData,
          avatar: partialNewState.avatar,
        };
        await EncryptedStorage.setItem('user_session', JSON.stringify(newData));
      } catch (error) {
        console.error('Error saving user session:', error);
      }
    }

    const newState = {...user, ...partialNewState};
    setUser(newState);
  };

  useEffect(() => {
    async function loadStorageData() {
      try {
        const encryptedStorage = await EncryptedStorage.getItem('user_session');

        if (encryptedStorage) {
          const formatted: Record<string, any> = JSON.parse(encryptedStorage);

          if (
            formatted &&
            isValidStorageData(formatted.accessToken, formatted.expiredDate)
          ) {
            updateStore({
              accessToken: formatted.accessToken,
              loading: false,
              expiredDate: formatted.expiredDate,
            });

            getMe().then(data => {
              getTariff().then(tariff => {
                updateUser({
                  cards: data.cards,
                  phone: data.phone,
                  balance: data.balance,
                  email: data.email,
                  name: data.name,
                  id: data.id,
                  birthday: data.birthday,
                  tariff: tariff.cashBack,
                });
              });
            });

            return;
          }

          if (formatted && hasAccessTokenCredentials(formatted.refreshToken)) {
            updateUser({
              avatar: formatted.avatar,
            });
            await refreshToken(formatted);
            return;
          }
        }

        updateStore({loading: false});
      } catch (error) {
        console.log('LoadStorageData Error: ', error);
      }
    }

    loadStorageData();
  }, []);

  const refreshTokenFromSecureStorage = async () => {
    try {
      const encryptedStorage = await EncryptedStorage.getItem('user_session');

      if (encryptedStorage) {
        const formatted: Record<string, any> = JSON.parse(encryptedStorage);

        if (formatted && formatted.refreshToken) {
          await refreshToken(formatted);
        }
      }
    } catch (error) {
      console.log('LoadStorageData Error: ', error);
    }
  };

  const refreshToken = async (formatted?: any): Promise<string | null> => {
    try {
      if (formatted.refreshToken) {
        const response = await refresh({
          refreshToken: formatted.refreshToken,
        }).catch(async () => {
          await EncryptedStorage.removeItem('user_session');
          updateStore({loading: false});
          return null;
        });

        if (response) {
          await EncryptedStorage.setItem(
            'user_session',
            JSON.stringify({
              refreshToken: formatted.refreshToken,
              accessToken: response.accessToken,
              expiredDate: new Date(response.accessTokenExp).toISOString(),
              devNomer: formatted.devNomer,
              nomer: formatted.nomer,
            }),
          );

          updateStore({
            accessToken: response.accessToken,
            expiredDate: response.accessTokenExp,
            loading: false,
          });

          getMe().then(data => {
            getTariff().then(tariff => {
              updateUser({
                cards: data.cards,
                phone: data.phone,
                balance: data.balance,
                email: data.email,
                name: data.name,
                id: data.id,
                birthday: data.birthday,
                tariff: tariff.cashBack,
              });
            });
          });

          return null;
        } else {
          updateStore({loading: false});
        }
      }
    } catch (error) {
      updateStore({loading: false});
    }

    return null;
  };

  const sendOtpFunc = (phone: string) => {
    const formatted = phone
      .replace(/[ ]+/g, '')
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');

    sendOtp({phone: formatted})
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
  };

  const loginFunc = async (phone: string, otp: string) => {
    try {
      const formatted = phone
        .replace(/[ ]+/g, '')
        .replace('(', '')
        .replace(')', '')
        .replace('-', '');

      const response = await login({otp: otp, phone: formatted});

      if (response.type === 'login-success') {
        await saveUserSession(response.tokens, response.client);

        updateStore({
          accessToken: response.tokens?.accessToken,
          expiredDate: new Date(response.tokens!.accessTokenExp).toISOString(),
        });

        getMe().then(data => {
          getTariff().then(tariff => {
            updateUser({
              cards: data.cards,
              phone: data.phone,
              balance: data.balance,
              email: data.email,
              name: data.name,
              id: data.id,
              birthday: data.birthday,
              tariff: tariff.cashBack,
            });
          });
        });
      }
      return response.type;
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось зайти в приложение!',
        props: {errorCode: 400},
      });
      return null;
    }
  };

  const registerFunc = async (
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

      const result = await register({
        phone: formatted,
        otp: otp,
        isTermsAccepted: isTermsAccepted,
        isPromoTermsAccepted: isPromoTermsAccepted,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          Toast.show({
            type: 'customErrorToast',
            text1: 'Не получилось зарегистрироваться!',
          });
        });

      if (result && result.type === 'register-success') {
        await saveUserSession(result.tokens, result.client);

        updateStore({
          accessToken: result.tokens.accessToken,
          expiredDate: new Date(result.tokens.accessTokenExp).toISOString(),
        });

        getMe().then(data => {
          getTariff().then(tariff => {
            updateUser({
              cards: data.cards,
              phone: data.phone,
              balance: data.balance,
              email: data.email,
              name: data.name,
              id: data.id,
              birthday: data.birthday,
              tariff: tariff.cashBack,
            });
          });
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

  async function loadUser() {
    console.log('Called');
    await getMe().then(data => {
      getTariff().then(tariff => {
        updateUser({
          cards: data.cards,
          phone: data.phone,
          balance: data.balance,
          email: data.email,
          name: data.name,
          id: data.id,
          birthday: data.birthday,
          tariff: tariff.cashBack,
        });
      });
    });
  }

  async function signOut() {
    try {
      await EncryptedStorage.removeItem('user_session');

      updateStore({
        accessToken: null,
        expiredDate: null,
      });

      updateUser({
        phone: null,
        email: null,
        balance: null,
        name: null,
        avatar: '',
        tariff: null,
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
        user: user,
        refreshToken: refreshToken,
        signOut: signOut,
        sendOtp: sendOtpFunc,
        register: registerFunc,
        login: loginFunc,
        refreshTokenFromSecureStorage: refreshTokenFromSecureStorage,
        loadUser: loadUser,
        updateUser: updateUser,
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
