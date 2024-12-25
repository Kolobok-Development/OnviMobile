import {useEffect, useState, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';

import useStore from '../state/store';

const useAppState = () => {
  const {toggleTransferBalanceModal} = useStore.getState();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  const previousAppState = useRef<AppStateStatus>(appState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('nextAppState: ', nextAppState);

      if (
        previousAppState.current === 'active' &&
        nextAppState === 'background'
      ) {
        // Logic when app goes to background
      }

      // Update appState and close modal
      toggleTransferBalanceModal(false);
      setAppState(nextAppState);

      // Update ref with the latest app state
      previousAppState.current = nextAppState;
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup on unmount
    return () => {
      subscription.remove();
    };
  }, [toggleTransferBalanceModal]); // No need to add appState to dependencies anymore

  return appState;
};

export default useAppState;
