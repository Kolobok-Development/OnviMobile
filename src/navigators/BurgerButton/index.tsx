import React, {useEffect} from 'react';

import {TouchableOpacity, StyleSheet, View, Platform} from 'react-native';

// Navigation
import {useNavigation} from '@react-navigation/native';
import {dp} from '../../utils/dp';
import {Menu} from 'react-native-feather';
import {ArrowLeft} from 'react-native-feather';

import {navigationRef} from '@navigators/BottomSheetStack';

import useStore from '../../state/store';

interface BurgerProps {
  isDrawerStack?: boolean;
  handleSheetChanges?: (index: number) => void;
}

import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';

const BurgerButton = ({
  isDrawerStack = false,
  handleSheetChanges,
}: BurgerProps) => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Промокоды'>>();

  const {isMainScreen, showBurgerButton} = useStore();

  if (!showBurgerButton) {
    return <></>;
  }

  if (isDrawerStack) {
    return (
      <View
        style={[
          styles.headerContainer,
          Platform.OS === 'android' && styles.androidShadow,
          Platform.OS === 'ios' && styles.iosShadow,
        ]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          {/* Your custom burger icon here */}
          <Menu stroke={'#000'} />
        </TouchableOpacity>
      </View>
    );
  }

  if (isMainScreen || isMainScreen === undefined) {
    return (
      <TouchableOpacity
        style={[
          {...styles.button},
          Platform.OS === 'android' && styles.androidShadow,
          Platform.OS === 'ios' && styles.iosShadow,
        ]}
        onPress={() => navigation.toggleDrawer()}>
        <Menu stroke={'#000'} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        {...styles.button},
        Platform.OS === 'android' && styles.androidShadow,
        Platform.OS === 'ios' && styles.iosShadow,
      ]}
      onPress={() => {
        navigationRef.current?.goBack();
        if (
          navigationRef.current?.getCurrentRoute()?.name === 'BusinessInfo' &&
          handleSheetChanges
        ) {
          handleSheetChanges(2);
        }
      }}>
      <ArrowLeft stroke={'#000'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: dp(40),
    width: dp(40),
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: dp(16),
    left: dp(16),
    borderRadius: 25,
    padding: 5,
    shadowColor: '#494949',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'FFFFFF',
  },
  line: {
    width: dp(17),
    height: dp(2),
    backgroundColor: 'black',
    margin: 2.5,
    color: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: dp(40),
    width: dp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 5,
    shadowColor: '#494949',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    justifyContent: 'center',
  },
  androidShadow: {
    elevation: 4, // Add elevation for Android shadow
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export {BurgerButton};
