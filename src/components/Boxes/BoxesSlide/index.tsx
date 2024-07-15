import { useEffect, useState } from "react";

import {StyleSheet, Dimensions, View} from 'react-native';

import {horizontalScale} from '../../../utils/metrics';

import {ScrollView} from 'react-native-gesture-handler';

import {useAppState} from '@context/AppContext';

import {dp} from '../../../utils/dp';

import {Box} from '@components/Boxes/Box';

const width = Dimensions.get('window').width;

interface BoxesSlideProps {
  boxes: any;
  navigation: any;
  params: any;
}

const BoxesSlide = ({boxes = [], navigation, params}: BoxesSlideProps) => {
  const {state, setState} = useAppState();
  const order = state.order;


  const [active, setActive] = useState(order?.box);

  return (
    <ScrollView
      horizontal
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View
        style={{
          width: (width - (horizontalScale(92) * 3) / 2 - 10 - dp(22)) / 2,
        }}
      />
      {boxes.map((box: any, key: number) => {
        return (
          <Box
            key={'box-' + key}
            label={box.number}
            onClick={() => {
              setActive(key);
              setState({
                ...state,
                order: {
                  ...order,
                  box: box.number,
                  prices: params.price,
                },
              });

              if (key !== undefined) {
                params.bottomSheetRef.current?.snapToPosition('95%');
                navigation.navigate('Launch', params);
              }
            }}
            active={active !== null && active === key}
          />
        );
      })}
      <View
        style={{
          width: (width - (horizontalScale(92) * 3) / 2 - 10 - dp(22)) / 2,
          flex: 1,
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  box: {
    width: dp(94.4),
    height: dp(91.8),
    margin: 10,
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderRadius: dp(21),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBox: {
    width: dp(94.4),
    height: dp(91.8),
    margin: 10,
    backgroundColor: 'rgba(191, 250, 0, 1)',
    borderRadius: dp(21),
  },
  boxText: {
    fontSize: dp(48),
    fontWeight: '600',
  },
});

export {BoxesSlide};
