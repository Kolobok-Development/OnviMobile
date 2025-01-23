import React from 'react';

import {TouchableOpacity, StyleSheet} from 'react-native';

import {ChevronLeft} from 'react-native-feather';

import {useNavigation, useRoute} from '@react-navigation/native';

import {dp} from '../../utils/dp';

import useStore from '../../state/store';

import {GeneralBottomSheetNavigationProp} from 'src/types/BottomSheetNavigation';

interface BackButtonProps {
  callback?: () => void;
  position?: string;
  index?: number;
}

const BackButton = ({
  callback,
  position = '60%',
  index = undefined,
}: BackButtonProps) => {
  const navigation = useNavigation<GeneralBottomSheetNavigationProp<any>>();

  const {bottomSheetRef} = useStore.getState();

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => {
        if (callback) {
          return callback();
        }
        if (bottomSheetRef?.current) {
          if (index !== undefined) {
            bottomSheetRef?.current?.snapToIndex(index);
          } else if (position) {
            bottomSheetRef?.current?.snapToPosition(position);
          }
        }
        navigation.goBack();
      }}>
      <ChevronLeft height={dp(20)} width={dp(20)} stroke={'#000000'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#F5F5F5',
    width: dp(40),
    height: dp(40),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(25),
  },
});

export {BackButton};
