import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthStack} from '@navigators/AuthStack';
import {DrawerStack} from '@navigators/DrawerStack';

import Toast from 'react-native-toast-message';
import {toastConfig} from '@styled/alerts/toasts';

import useStore from '../../state/store';
import {navigationRef} from '../../services/api/interceptors';

const Application = () => {
  const isAuthenticated = useStore().isAuthenticated;

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        {!isAuthenticated ? <AuthStack /> : <DrawerStack />}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export {Application};
