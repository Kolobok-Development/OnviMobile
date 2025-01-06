import {useNavigation, useRoute} from '@react-navigation/native';

import useStore from '../../../state/store';

import PortalLaunch from './Portal';
import DefaultLaunch from './Default';

import {
  GeneralBottomSheetNavigationProp,
  GeneralBottomSheetRouteProp,
} from 'src/types/BottomSheetNavigation';
import VacuumLaunch from '@components/BottomSheetViews/Launch/Vacuum';

const Launch = () => {
  const navigation =
    useNavigation<GeneralBottomSheetNavigationProp<'Launch'>>();

  const route = useRoute<GeneralBottomSheetRouteProp<'Launch'>>();

  const {isBottomSheetOpen, setOrderDetails, orderDetails} =
    useStore.getState();

  const isOpened = isBottomSheetOpen;

  const type: string = route.params.bayType;

  const onSelect = (name: string, price: number) => {
    setOrderDetails({
      ...orderDetails,
      sum: price,
      name: name,
    });

    navigation.navigate('Payment', {});
  };

  if (orderDetails?.type === 'Portal') {
    return <PortalLaunch isOpened={isOpened} onSelect={onSelect} />;
  }

  if (type === 'VACUUM') {
    return <VacuumLaunch />;
  }
  return <DefaultLaunch />;
};

export {Launch};
