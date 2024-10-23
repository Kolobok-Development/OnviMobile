import {useNavigation, useRoute} from '@react-navigation/native';

import useStore from '../../../state/store';

import PortalLaunch from './Portal';
import DefaultLaunch from './Default';

import {
  GeneralBottomSheetNavigationProp,
  GeneralBottomSheetRouteProp,
} from 'src/types/BottomSheetNavigation';

const Launch = () => {
  const navigation =
    useNavigation<GeneralBottomSheetNavigationProp<'Launch'>>();

  const {isBottomSheetOpen, setOrderDetails, orderDetails} =
    useStore.getState();

  const isOpened = isBottomSheetOpen;

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
  return <DefaultLaunch />;
};

export {Launch};
