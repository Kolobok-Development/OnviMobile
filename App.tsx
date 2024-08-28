import React, {useEffect, useState} from 'react';

import {Alert, Dimensions, StyleSheet, View} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ThemeProvider} from '@context/ThemeProvider';
import {AuthProvider} from '@context/AuthContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Application} from '@components/Application';
import ThemeWrapper from '@components/ThemeWrapper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IntlProvider} from 'react-intl';
import FlashMessage, {showMessage, hideMessage} from 'react-native-flash-message';

import NetInfo from '@react-native-community/netinfo';

import PushNotifications from '@services/PushNotifications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App(): React.JSX.Element {
  const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    console.log(isConnected);
  }, [isConnected]);

  useEffect(() => {
    console.log('CHECKING NETWORK');
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log(`Network state =? ${JSON.stringify(state)}`);
      const networkState = state.isConnected ? state.isConnected : false;
      setConnected(networkState);

      if (!networkState) {
        console.log('NO Network');
        showMessage({
          message: 'Нет подключения к интернету',
          type: 'danger',
          autoHide: true,
          icon: 'danger',
          duration: 3000,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <PushNotifications />
      <ThemeProvider>
        <ThemeWrapper>
          <AuthProvider>
            <IntlProvider locale={'ru'}>
              <GestureHandlerRootView style={{flex: 1}}>
                <SafeAreaView style={styles.container}>
                  <View style={{height: Dimensions.get('window').height}}>
                    {!isConnected && <FlashMessage position="top" />}
                    <Application />
                  </View>
                </SafeAreaView>
              </GestureHandlerRootView>
            </IntlProvider>
          </AuthProvider>
        </ThemeWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
