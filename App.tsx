import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {ThemeProvider} from './src/context/ThemeProvider';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Application} from './src/components/Application';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IntlProvider} from 'react-intl';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import NetInfo from '@react-native-community/netinfo';
import useStore from './src/state/store';
import DeviceInfo from 'react-native-device-info';
import {createUserMeta, updateUserMeta} from './src/services/api/user';
import {DeviceMeta} from './src/types/models/User';
import {hasMetaDataChanged} from './src/services/validation/meta.validator';
import RemoteNotifications from './src/services/push-notifications/RemoteNotifications';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import useAppState from './src/hooks/useAppState';
import Config from 'react-native-config';
import {
  DdSdkReactNative,
  DatadogProviderConfiguration,
  DatadogProvider,
} from '@datadog/mobile-react-native';

if (__DEV__) {
  require('./ReactotronConfig');
}

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

type DatadogWrapperProps = {
  children: React.ReactNode;
};

const DatadogWrapper = ({children}: DatadogWrapperProps) => {
  const [datadogConfig, setDatadogConfig] =
    useState<DatadogProviderConfiguration | null>(null);
  const [initializationError, setInitializationError] = useState(false);

  useEffect(() => {
    const initializeDatadog = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();

        const config = new DatadogProviderConfiguration(
          'puba21093aa63718370f3d12b6069ca901c',
          'production',
          '1224164e-aeb1-46b7-a6ef-ec198d1946f7',
          true,
          true,
          true,
        );

        config.site = 'EU1';
        config.longTaskThresholdMs = 100;
        config.nativeCrashReportEnabled = true;
        config.sessionSamplingRate = 100;
        config.serviceName = 'onvi-mobile';

        await DdSdkReactNative.initialize(config);
        await DdSdkReactNative.setUserInfo({id: deviceId});

        setDatadogConfig(config);
      } catch (error) {
        setInitializationError(true);
      }
    };

    initializeDatadog();
  }, []);

  // Если инициализация еще не завершена
  if (!datadogConfig && !initializationError) {
    return null;
  }

  // Если произошла ошибка - рендерим без провайдера
  if (initializationError) {
    return <>{children}</>;
  }

  // Успешная инициализация
  return (
    <DatadogProvider configuration={datadogConfig!}>{children}</DatadogProvider>
  );
};

function App(): React.JSX.Element {
  const [isConnected, setConnected] = useState(true);
  const {loadUser, user, fcmToken} = useStore.getState();

  configureReanimatedLogger({
    level: ReanimatedLogLevel.error,
    strict: true,
  });

  useAppState();

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
    loadUser();
    const syncMetaData = async () => {
      if (isConnected && user?.id) {
        try {
          const localMetaDataPartial: DeviceMeta = await getLocalMetaData();

          if (!user?.meta) {
            await createUserMeta({
              ...localMetaDataPartial,
              appToken: fcmToken ?? '',
              clientId: user.id,
            });
          } else if (
            hasMetaDataChanged(
              {
                ...localMetaDataPartial,
                appToken: fcmToken ?? '',
                clientId: user.id,
                metaId: user.meta.metaId,
              },
              user.meta,
            )
          ) {
            await updateUserMeta({
              ...localMetaDataPartial,
              appToken: fcmToken ?? '',
              clientId: user.id,
              metaId: user.meta.metaId,
            });
          }
        } catch (error: any) {
        }
      }
    };

    syncMetaData();
  }, [fcmToken, isConnected, loadUser, user?.id]);

  return (
    <DatadogWrapper>
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
    </DatadogWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
