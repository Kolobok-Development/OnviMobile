import AppMetrica from '@appmetrica/react-native-analytics';
import useStore from '@state/store';
import {useEffect} from 'react';

import Config from 'react-native-config';

AppMetrica.activate({
  apiKey: Config.APP_METRICA_API_KEY ?? '',
  sessionTimeout: 120,
  firstActivationAsUpdate: true,
  logs: true,
});

const AppMetricaInit = () => {
  const user = useStore(state => state.user);

  useEffect(() => {
    if (user?.id) {
      AppMetrica.setUserProfileID(user.id.toString());
    }
  }, [user?.id]);

  return <></>;
};

export {AppMetricaInit};
