import {dp} from '../../utils/dp';

import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export default function PromosPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View>
        <SkeletonPlaceholder.Item
          marginTop={dp(30)}
          width={'100%'}
          height={dp(80)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
        <SkeletonPlaceholder.Item
          width={'100%'}
          height={dp(80)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
        <SkeletonPlaceholder.Item
          width={'100%'}
          height={dp(80)}
          borderRadius={dp(10)}
          alignSelf="center"
          marginBottom={dp(10)}
        />
      </View>
    </SkeletonPlaceholder>
  );
}
