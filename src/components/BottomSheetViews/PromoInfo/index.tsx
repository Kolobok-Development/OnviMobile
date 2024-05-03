import {StyleSheet, View} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {dp} from '../../../utils/dp';

const PromoInfo = () => {
  return (
    <View
      style={{
        ...styles.container,
      }}>
      <BottomSheetScrollView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: dp(22),
    display: 'flex',
    flexDirection: 'column',
  },
});

export {PromoInfo};
