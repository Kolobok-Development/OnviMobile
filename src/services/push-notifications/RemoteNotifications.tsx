import {useEffect, useState} from 'react';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import useStore from '../../state/store.ts';

messaging().setBackgroundMessageHandler(async () => {});

const RemoteNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const {setFcmToken} = useStore();

  useEffect(() => {
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const isEnabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isEnabled) {
        setIsEnabled(true);
        await getDeviceToken();
      }
    }

    requestUserPermission();
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    // Handle notifications that are received while the application is in Foreground state
    messaging().onMessage(handleNotification);
    // Handle the notification that opened the app from Background state
    messaging().onNotificationOpenedApp(handleNotification);
    // Handle the notification that opened the app from Quit state
    messaging().getInitialNotification().then(handleNotification);
  }, [isEnabled]);

  const handleNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    if (!remoteMessage) {
      return;
    }

    if (remoteMessage.data?.postId) {
      // navigate to this post... - we need to think about it...
    }
  };

  const getDeviceToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const newToken = await messaging().getToken();
    setFcmToken(newToken);
  };

  return null;
};

export default RemoteNotifications;
