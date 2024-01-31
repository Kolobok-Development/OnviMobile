import React from 'react';

import {useAuth} from '@context/AuthContext';
import {AuthStack} from '@navigators/AuthStack';
import {DrawerStack} from '@navigators/DrawerStack';

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
      {!store.accessToken ? <AuthStack /> : <DrawerStack />}
      <Toast config={toastConfig} />
    </>
  );
};

export {Application};
