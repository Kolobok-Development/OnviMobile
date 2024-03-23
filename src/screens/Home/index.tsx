import { useRef, useState, useMemo, useCallback } from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppState } from '@context/AppContext';

// Burger and Balance Top Button
import {BurgerButton} from '@navigators/BurgerButton';
import {Balance} from '@components/Balance';

// Map Component
import { Map } from '@components/Map';

// Bottom Sheet Navigator
import BottomSheet, {BottomSheetHandle} from '@gorhom/bottom-sheet';

import {dp} from '../../utils/dp';

import {BottomSheetStack} from '@navigators/BottomSheetStack';
import {Navigation} from 'react-native-feather';

const Home = ({navigation}: any) => {
  const [visible, setVisible] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(1);

  const cameraRef = useRef<any>(null);

  const userLocationRef = useRef<any>(null);

  const bottomSheetRef = useRef(null);

  const { state } = useAppState()

  // variables
  const snapPoints = useMemo(() => ['25%', '42%', '60%', '95%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    setVisible(index ? true : false);
    setBottomSheetIndex(index);
  }, []);

  const findMe = async () => {
    cameraRef.current.setCamera({
      centerCoordinate: [userLocationRef.current.lon, userLocationRef.current.lat],
      zoomLevel: 15
    })
  };

  const renderHandleComponent = useCallback((props: any) => {
    const filters = state.filters

    function extractValues(obj: any) {
      const values = [];

      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          for (const innerKey in obj[key]) {
            values.push(obj[key][innerKey]);
          }
        }
      }

      return values;
    }

    const extractedFilters = useCallback(() => {
      return extractValues(filters);
    }, [filters]);

    return (
      <BottomSheetHandle {...props} style={{paddingBottom: 2}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1, alignSelf: 'flex-end'}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}>
              {extractedFilters().map((value, index) => (
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
              style={{...styles.findMe}}
              onPress={async () => {
                await findMe();
              }}>
              <Navigation fill={'white'} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
      </BottomSheetHandle>
    );
  }, []);

  return (
    <GestureHandlerRootView style={styles.master}>
      <View style={{...styles.container}}>
          <Map
            bottomSheetRef={bottomSheetRef}
            bottomSheetIndex={bottomSheetIndex}
            cameraRef={cameraRef}
            userLocationRef={userLocationRef}
          />
          <BottomSheet
            handleComponent={renderHandleComponent}
            ref={bottomSheetRef}
            handleIndicatorStyle={{backgroundColor: '#a1a1a1', display: 'none'}}
            keyboardBlurBehavior="restore"
            index={bottomSheetIndex}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundComponent={({style}) => (
              <View
                style={[style, styles.transparentBackground, styles.shadow]}
              />
            )}
            style={styles.shadow}
            topInset={0}>
            <View style={styles.contentContainer}>
              <BottomSheetStack
                bottomSheetRef={bottomSheetRef}
                active={visible}
                drawerNavigation={navigation}
                cameraRef={cameraRef}
              />
            </View>
          </BottomSheet>
        
        <View style={{...styles.burger}}>
          <BurgerButton bottomSheetIndex={bottomSheetIndex} />
        </View>
        <View style={{...styles.balance}}>
          <Balance
            bottomSheetIndex={bottomSheetIndex}
            bottomSheetRef={bottomSheetRef}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

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
    // zIndex: 999999
  },
  balance: {
    position: 'absolute',
    top: dp(28),
    right: dp(5),
    flexDirection: 'row',
    alignItems: 'center',
    // zIndex: 999999
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
    zIndex: 1,
    // position: 'absolute',
    // top: dp(100),
    // marginRight: dp(4),
    // right: dp(10),
    borderRadius: 45,
    shadowColor: '#494949',
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  //
  scrollViewContent: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  box: {
    // width: dp(94),
    height: dp(24),
    borderRadius: dp(69),
    backgroundColor: '#0B68E1',
    display: 'flex',
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
