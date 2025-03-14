import React, {useRef, useState, useMemo, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useReducedMotion} from 'react-native-reanimated';
import {BurgerButton} from '@navigators/BurgerButton';
import {Balance} from '@components/Balance';
import {Map} from '@components/Map';
import BottomSheet, {BottomSheetHandle} from '@gorhom/bottom-sheet';
import {dp} from '../../utils/dp';
import {BottomSheetStack} from '@navigators/BottomSheetStack';
import {Navigation} from 'react-native-feather';
import useStore from '../../state/store';
import TokenExpiryTester from '../../components/TokenExpiryTester';

import {CameraReference} from '@components/Map';

const snapPoints = ['25%', '42%', '60%', '95%'];

const Home = React.memo(({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(2);
  const cameraRef = useRef<CameraReference>(null);
  const userLocationRef = useRef<any>(null);
  const {filters, setIsBottomSheetOpen, setBottomSheetRef} =
    useStore.getState();

  const {isDraggable} = useStore();

  const reduceMotion = useReducedMotion();
  const bsRef = useRef(null);

  useEffect(() => {
    if (bsRef.current) {
      setBottomSheetRef(bsRef);
    }
  }, [setBottomSheetRef]);

  const handleSheetChanges = useCallback((index: number) => {
    setVisible(index ? true : false);
    setBottomSheetIndex(index);
    setIsBottomSheetOpen(index >= 2);
  }, []);

  const setCamera = (val?: {longitude: number; latitude: number}) => {
    cameraRef.current?.setCameraPosition(val);
  };

  const renderHandleComponent = useCallback(
    (props: any) => {
      const extractedFilters = useMemo(() => {
        return Object.values(filters)
          .flat()
          .map((filter: any) => filter);
      }, [filters]);

      return (
        <BottomSheetHandle {...props} style={styles.handle}>
          <View style={styles.handleContent}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              {extractedFilters.map((value, index) => (
                <View
                  key={index}
                  style={[styles.filterBox, {width: value.length * dp(10)}]}>
                  <Text style={styles.filterText}>{value}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.findMe} onPress={() => setCamera()}>
              <Navigation fill="white" color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
        </BottomSheetHandle>
      );
    },
    [filters, setCamera],
  );

  return (
    <GestureHandlerRootView style={styles.master}>
      <View style={styles.container}>
        <Map ref={cameraRef} userLocationRef={userLocationRef} />
        <BottomSheet
          enableContentPanningGesture={isDraggable}
          animateOnMount={!reduceMotion}
          enableHandlePanningGesture={isDraggable}
          handleComponent={renderHandleComponent}
          ref={bsRef}
          handleIndicatorStyle={styles.handleIndicator}
          keyboardBlurBehavior="restore"
          index={bottomSheetIndex}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundComponent={() => (
            <View style={[styles.transparentBackground, styles.shadow]} />
          )}
          style={styles.shadow}
          topInset={0}>
          <View style={styles.contentContainer}>
            <BottomSheetStack
              active={visible}
              drawerNavigation={navigation}
              cameraRef={cameraRef}
              setCamera={setCamera}
            />
          </View>
        </BottomSheet>

        <View style={styles.burger}>
          <BurgerButton handleSheetChanges={handleSheetChanges} />
        </View>
        <View style={styles.balance}>
          <Balance bottomSheetIndex={bottomSheetIndex} />
        </View>

        {/* Token Expiry Tester Component - Only visible in development */}
        {/*{__DEV__ && (*/}
        {/*  <View style={styles.tokenTester}>*/}
        {/*    <TokenExpiryTester />*/}
        {/*  </View>*/}
        {/*)}*/}
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
    top: dp(28),
    left: dp(5),
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
    top: dp(28),
    right: dp(5),
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
  findMe: {
    height: dp(45),
    width: dp(45),
    backgroundColor: '#000',
    borderRadius: 45,
    shadowColor: '#494949',
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    backgroundColor: '#a1a1a1',
    display: 'none',
  },
  contentContainer: {
    flex: 1,
  },
  tokenTester: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});

export {Home};
