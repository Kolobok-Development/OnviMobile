import React, {useEffect, useState} from 'react';

import {Dimensions, StyleSheet, View} from 'react-native';
import {ThemeProvider} from './src/context/ThemeProvider';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Application} from './src/components/Application';
// import ThemeWrapper from '@components/ThemeWrapper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IntlProvider} from 'react-intl';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';
import useStore from './src/state/store';
import DeviceInfo from 'react-native-device-info';
import {createUserMeta, updateUserMeta} from './src/services/api/user';
import {DeviceMeta } from './src/types/models/User';
import {hasMetaDataChanged} from './src/services/validation/meta.validator';
import RemoteNotifications from './src/services/push-notifications/RemoteNotifications';

const getLocalMetaData = async (): Promise<DeviceMeta> => {
  const deviceId = await DeviceInfo.getUniqueId();
  const model = DeviceInfo.getModel();
  const name = DeviceInfo.getDeviceNameSync();
  const platform = DeviceInfo.getSystemName();
  const platformVersion = DeviceInfo.getSystemVersion();
  const manufacturer = DeviceInfo.getManufacturerSync();

  return {
    deviceId,
    model,
    name,
    platform,
    platformVersion,
    manufacturer,
  };
};

function App(): React.JSX.Element {
  const [isConnected, setConnected] = useState(true);
  const {loadUser, user, fcmToken} = useStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const networkState = state.isConnected ? state.isConnected : false;
      setConnected(networkState);

      if (!networkState) {
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

  useEffect(() => {
    loadUser()
    const syncMetaData = async () => {
      if (isConnected && user?.id) {
        try {
          const localMetaDataPartial: DeviceMeta = await getLocalMetaData();

          if (!user?.meta) {
            await createUserMeta({
              ...localMetaDataPartial,
              appToken: fcmToken,
              clientId: user.id,
              metaId: null,
            });
          } else if (
            hasMetaDataChanged(
              {
                ...localMetaDataPartial,
                appToken: fcmToken,
                clientId: user.id,
                metaId: user.meta.metaId,
              },
              user.meta,
            )
          ) {
            await updateUserMeta({
              ...localMetaDataPartial,
              appToken: fcmToken,
              clientId: user.id,
              metaId: user.meta.metaId,
            });
          } else {
            console.log('Metadata is up-to-date. No action needed.');
          }
        } catch (error: any) {
          console.error('Error syncing metadata:', error);
        }
      }
    };

    syncMetaData();
  }, [fcmToken, isConnected, loadUser, user?.id]);

  return (
    <ThemeProvider>
      <RemoteNotifications />
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
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
