import {useEffect, useState} from 'react';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Message handled in the background!',
    JSON.stringify(remoteMessage, null, 2),
  );
});

const RemoteNotifications = () => {
  const [enabled, setEnabled] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    console.log('INITIALIZING NOTIFICATION SERVICE ---->');
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('AUTHORIZED NOTIFICATION STATUS ---->', authStatus);
      console.log('PROVISIONAL NOTIFICATION STATUS ---->', enabled);

      if (enabled) {
        setEnabled(true);
        await getDeviceToken();
      }
    }

    requestUserPermission();
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Handle notifications that are received while the application is in Foreground state
    messaging().onMessage(handleNotification);
    // Handle the notification that opened the app from Background state
    messaging().onNotificationOpenedApp(handleNotification);
    // Handle the notification that opened the app from Quit state
    messaging().getInitialNotification().then(handleNotification);
  }, [enabled]);

  const handleNotification = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    if (!remoteMessage) {
      return;
    }

    console.log(JSON.stringify(remoteMessage, null, 2));

    if (remoteMessage.data?.postId) {
      // navigate to this post... - we need to think about it...
    }
  };

  const getDeviceToken = async () => {
    console.log('GENERATING TOKEN...');
    await messaging().registerDeviceForRemoteMessages();
    const newToken = await messaging().getToken();
    console.log(`NEW TOKEN ----> ${newToken}`);
    setToken(newToken);
  };

  useEffect(() => {
    console.log('Notification Token ===> :  ', token);
  }, [token]);

  return null;
};

export default RemoteNotifications;
