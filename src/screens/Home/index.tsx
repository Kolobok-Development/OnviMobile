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

import {useFocusEffect} from '@react-navigation/native';

const snapPoints = ['25%', '42%', '60%', '95%'];

import {CameraReference} from '@components/Map';

const Home = React.memo(({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(2);
  const cameraRef = useRef<CameraReference>(null);
  const userLocationRef = useRef<any>(null);
  const {filters, setIsMainScreen, setIsBottomSheetOpen, setBottomSheetRef} =
    useStore.getState();
  const reduceMotion = useReducedMotion();

  const bsRef = useRef(null);

  useEffect(() => {
    if (bsRef.current) {
      setBottomSheetRef(bsRef);
    }
  }, [bsRef.current, setBottomSheetRef]);

  // Это действие будет выполнено, когда экран получит фокус
  useFocusEffect(
    useCallback(() => {
      setIsMainScreen(true);

      return () => {
        console.log('Screen lost focus!');
        setIsMainScreen(false);
      };
    }, []),
  );

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
        <BottomSheetHandle {...props} style={{paddingBottom: 2}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1, alignSelf: 'flex-end'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}>
                {extractedFilters.map((value, index) => (
                  <View
                    key={index}
                    style={{...styles.box, width: value.length * dp(10)}}>
                    <Text
                      style={{
                        color: '#ffffff',
                        fontSize: dp(12),
                        fontWeight: '600',
                      }}>
                      {value}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View>
              <TouchableOpacity
                style={styles.findMe}
                onPress={() => setCamera()}>
                <Navigation fill={'white'} color={'white'} />
              </TouchableOpacity>
            </View>
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
          animateOnMount={!reduceMotion}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={false}
          handleComponent={renderHandleComponent}
          ref={bsRef}
          handleIndicatorStyle={{backgroundColor: '#a1a1a1', display: 'none'}}
          keyboardBlurBehavior="restore"
          index={bottomSheetIndex}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundComponent={() => (
            <View style={[styles.transparentBackground, styles.shadow]}></View>
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
  contentContainer: {
    flex: 1,
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
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
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
  scrollViewContent: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  box: {
    height: dp(24),
    borderRadius: dp(69),
    backgroundColor: '#0B68E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dp(16),
  },
  line: {
    borderBottomWidth: 5,
    borderColor: 'grey',
    width: dp(134),
    borderRadius: dp(10),
  },
  lineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp(18),
  },
});

export {Home};
