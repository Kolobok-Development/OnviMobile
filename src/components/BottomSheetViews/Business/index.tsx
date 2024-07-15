import React from 'react';
import {Text, View, Image, Dimensions, StyleSheet} from 'react-native';

// styled components
import {Card} from '@styled/cards';

import {useRoute} from '@react-navigation/native';

import {dp} from '../../../utils/dp';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useAppState} from '@context/AppContext';

const Business = () => {
  const route: any = useRoute();

  const {state, setState} = useAppState();
  const order = state.order;

  const selectCarwash = (carwash: any) => {
    setState({
      ...state,
      order: {
        ...order,
        id: carwash.id,
        type: carwash.type,
        name: carwash.name,
      },
    });

    navigateBottomSheet('BusinessInfo', carwash);
    route.params.bottomSheetRef.current?.snapToPosition('60%');
  };

  return (
    <View style={styles.container}>
      <Card>
        {route.params.carwashes.map((carwash: any, index: number) => {
          return (
            <View style={styles.button} key={'carwash-' + index}>
              <View
                style={{
                  flex: 1,
                }}>
                <Image
                  source={require('../../../assets/icons/small-icon.png')}
                  style={styles.circleImage}
                />
              </View>
              <View style={{flex: 5}}>
                <TouchableOpacity onPress={() => selectCarwash(carwash)}>
                  <Text style={styles.title}>{carwash.name}</Text>
                  <Text style={styles.text}>{carwash.address}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('screen').height,
  },
  button: {
    backgroundColor: '#F5F5F5',
    minHeight: dp(70),
    display: 'flex',
    borderRadius: 22,
    padding: dp(14),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(5),
  },
  title: {
    fontSize: dp(16),
    fontWeight: '600',
    lineHeight: dp(20),
    color: '#000',
  },
  text: {
    fontSize: dp(16),
    fontWeight: '400',
    lineHeight: dp(20),
    color: '#000',
  },
  circleImage: {
    width: dp(39),
    height: dp(39),
  },
});

export {Business};
