import React, {useRef, useState, useMemo, useEffect, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Platform} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BurgerButton} from '@navigators/BurgerButton';
import {Balance} from '@components/Balance';
import {Map} from '@components/Map';
import BottomSheet from '@gorhom/bottom-sheet';
import {dp} from '../../utils/dp';
import {BottomSheetStack} from '@navigators/BottomSheetStack';
import useStore from '../../state/store';
import {useReducedMotion, useSharedValue} from 'react-native-reanimated';

import {CameraReference} from '@components/Map';
import FindMeButton from '@screens/Home/FindMeButton.tsx';
import style from '@styled/inputs/RadioButton/style.ts';
import {useSnapPoints, MAX_SNAP_INDEX} from '../../utils/snapPoints';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Home = React.memo(({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(1);
  const [filtersOpacity] = useState(1);

  // Calculate dynamic snap points based on screen size
  // Use the global snap points hook to ensure consistency across screens
  const snapPoints = useSnapPoints();

  // Set snap points in global state for use in other components
  const {setBottomSheetSnapPoints} = useStore.getState();

  // Update global snap points when local snap points change
  useEffect(() => {
    setBottomSheetSnapPoints(snapPoints);
  }, [snapPoints]);

  const cameraRef = useRef<CameraReference>(null);
  const userLocationRef = useRef<any>(null);
  const {setIsBottomSheetOpen, setBottomSheetRef} = useStore.getState();

  const {isDraggable} = useStore();

  const bsRef = useRef(null);

  const currentPosition = useSharedValue(0);

  useEffect(() => {
    if (bsRef.current) {
      setBottomSheetRef(bsRef);
    }
  }, [setBottomSheetRef]);

  const setCamera = (val?: {longitude: number; latitude: number}) => {
    cameraRef.current?.setCameraPosition(val);
  };

  const handleSheetChanges = useCallback((index: number) => {
    setVisible(index ? true : false);
    setIsBottomSheetOpen(index >= 2);
  }, []);

  const memoizedBottomSheetStack = useMemo(
    () => (
      <BottomSheetStack
        active={visible}
        drawerNavigation={navigation}
        cameraRef={cameraRef}
        setCamera={setCamera}
      />
    ),
    [visible, navigation, cameraRef, setCamera],
  );

  return (
    <GestureHandlerRootView style={styles.master}>
      <View style={styles.container}>
        <Map ref={cameraRef} userLocationRef={userLocationRef} />

        {/* FindMe button with built-in position tracking and opacity fade */}
        <FindMeButton
          animatedPosition={currentPosition}
          animatedIndex={currentPosition}
          onPress={() => setCamera()}
        />

        <BottomSheet
          enableContentPanningGesture={isDraggable}
          enableHandlePanningGesture={isDraggable}
          ref={bsRef}
          handleIndicatorStyle={styles.handleIndicator}
          keyboardBlurBehavior="restore"
          animatedPosition={currentPosition}
          enableOverDrag={true}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          snapPoints={snapPoints}
          index={bottomSheetIndex}
          onChange={handleSheetChanges}
          backgroundComponent={() => (
            <View style={[styles.transparentBackground, styles.shadow]} />
          )}
          style={styles.shadow}
          topInset={0}>
          <View style={styles.contentContainer}>
            {memoizedBottomSheetStack}
          </View>
        </BottomSheet>

        <View style={[styles.burger]}>
          <BurgerButton />
        </View>
        <View style={[styles.balance]}>
          <Balance bottomSheetIndex={bottomSheetIndex} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  master: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    position: 'absolute',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burger: {
    position: 'absolute',
    top: dp(16),
    left: dp(6),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        top: dp(40),
      },
    }),
  },
  balance: {
    position: 'absolute',
    top: dp(20),
    right: dp(6),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        top: dp(40),
      },
    }),
  },
  handle: {
    paddingBottom: 2,
  },
  handleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  filterBox: {
    height: dp(24),
    borderRadius: dp(69),
    backgroundColor: '#0B68E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dp(16),
  },
  filterText: {
    color: '#ffffff',
    fontSize: dp(12),
    fontWeight: '600',
  },
  lineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp(18),
  },
  line: {
    borderBottomWidth: 5,
    borderColor: 'grey',
    width: dp(134),
    borderRadius: dp(10),
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 9.11,
    elevation: 14,
  },
  handleIndicator: {
    display: 'none',
  },
  contentContainer: {
    flex: 1,
  },
  findMeContainer: {
    position: 'absolute',
    right: dp(20),
    zIndex: 999,
    backgroundColor: 'red',
    // Add shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export {Home};
