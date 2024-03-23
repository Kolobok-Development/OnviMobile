import React from 'react';

import {useAuth} from '@context/AuthContext';
import {AuthStack} from '@navigators/AuthStack';
import {DrawerStack} from '@navigators/DrawerStack';
import {AppProvider} from '@context/AppContext';

import Toast from 'react-native-toast-message';
import {toastConfig} from '@styled/alerts/toasts';

const Application = () => {
  const context = useAuth();
  if (!context) {
    return null;
  }

  const {store} = context;

  return (
    <>
      <AppProvider
        initialState={{
          value: '',
          filters: {},
          businesses: [],
          order: {},
          bottomSheetPosition: {},
          bottomSheetOpened: false,
          isMainScreen: true
      }}>
        {store.accessToken ? <AuthStack /> : <DrawerStack />}
        <Toast config={toastConfig} />
      </AppProvider>
    </>
  );
};

export {Application};
