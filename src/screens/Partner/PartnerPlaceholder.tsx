import { Text, View } from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {dp} from '../../utils/dp';

export default function PartnerPlaceholder() {
    return <SkeletonPlaceholder borderRadius={4}>
        <View>
        <SkeletonPlaceholder.Item
            marginTop={dp(15)}
            width={'100%'}
            height={dp(190)}
            borderRadius={dp(10)}
            alignSelf="flex-start"
            marginBottom={dp(10)}
        />
        <Text style={{marginTop: 6, fontSize: 14, lineHeight: 18}}>
            Hello world
        </Text>
        <Text
            style={{marginTop: 6, fontSize: 14, lineHeight: 18, width: '50%'}}>
            Hello world
        </Text>
        <Text
            style={{marginTop: 6, fontSize: 14, lineHeight: 18, width: '25%'}}>
            Hello world
        </Text>
        </View>
    </SkeletonPlaceholder>
}