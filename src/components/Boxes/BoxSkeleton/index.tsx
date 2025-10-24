import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {dp} from '../../../utils/dp';
import {View} from 'react-native';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../../../utils/metrics';

interface IBoxSkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
}

const BoxSkeleton = ({
  width = horizontalScale(92),
  height = verticalScale(92),
  borderRadius = moderateScale(21),
}: IBoxSkeletonProps) => {
  return (
    <View style={{margin: dp(10)}}>
      <SkeletonPlaceholder
        borderRadius={12}
        speed={1200}
        highlightColor="#e0e0e0"
        backgroundColor="#f2f2f2">
        <SkeletonPlaceholder.Item
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      </SkeletonPlaceholder>
    </View>
  );
};

export default BoxSkeleton;
