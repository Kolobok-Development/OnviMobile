import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {dp} from '../../../../utils/dp';

export default function PostsPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={styles.news}>
        <View style={styles.leftNewsColumn}>
          <SkeletonPlaceholder.Item style={styles.leftPlaceholder} />
        </View>
        <View style={styles.rightNewsColumn}>
          <SkeletonPlaceholder.Item style={styles.rightPlaceholder} />
          <SkeletonPlaceholder.Item style={styles.rightPlaceholder} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
}

const styles = StyleSheet.create({
  leftPlaceholder: {
    flex: 1,
    borderWidth: 26,
    marginTop: dp(16),
  },
  rightPlaceholder: {
    flex: 1,
    marginTop: dp(16),
    borderRadius: 25,
    minHeight: dp(120),
  },
  news: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: dp(280),
  },
  leftNewsColumn: {
    flex: 1,
  },
  rightNewsColumn: {
    flex: 2,
    marginLeft: dp(8),
  },
});
