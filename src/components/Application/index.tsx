import React /*, {useEffect}*/ from 'react';

import {AuthStack} from '@navigators/AuthStack';
import {DrawerStack} from '@navigators/DrawerStack';

import Toast from 'react-native-toast-message';
import {toastConfig} from '@styled/alerts/toasts';

// import TransferBalanceModal from '@components/TransferBalanceModal';

import useStore from '../../state/store';

const Application = () => {
  const {
    accessToken /*, transferBalanceModalVisible, toggleTransferBalanceModal*/,
  } = useStore.getState();

  return (
    <>
      {!accessToken ? <AuthStack /> : <DrawerStack />}
      <Toast config={toastConfig} />

      {/* <TransferBalanceModal /> */}
    </>
  );
};

export {Application};
