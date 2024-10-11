import React from 'react';

import {AuthStack} from '@navigators/AuthStack';
import {DrawerStack} from '@navigators/DrawerStack';

import Toast from 'react-native-toast-message';
import {toastConfig} from '@styled/alerts/toasts';

import useStore from '../../state/store';

const Application = () => {
  const {accessToken} = useStore();

  return (
    <>
      {!accessToken ? <AuthStack /> : <DrawerStack />}
      <Toast config={toastConfig} />
    </>
  );
};

export {Application};
