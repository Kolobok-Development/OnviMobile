import {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@context/ThemeProvider';

import {useNavigation, useRoute} from '@react-navigation/native';

import {dp} from '../../../utils/dp';
import {Button} from '@styled/buttons';

import {useAppState} from '@context/AppContext';

import {ScrollView} from 'react-native-gesture-handler';
import {FilterList} from '@components/FiltersList';

// components
import {BusinessHeader} from '@components/Business/Header';
import {SumInput} from '@styled/inputs/SumInput';
import {ActionButton} from '@styled/buttons/ActionButton';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  horizontalScale,
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from '../../../utils/metrics';
import {ExpandableView} from '@styled/views/ExpandableView';
import {Price} from '../../../api/AppContent/types';

const Launch = () => {
  const {theme}: any = useTheme();
  const [value, setValue] = useState(150);
  const measureTypeData = ['рубли'];

  const {state, setState} = useAppState();

  const colors: Array<'yellow' | 'blue' | 'grey' | 'black'> = [
    'yellow',
    'blue',
    'grey',
    'black',
  ];

  const navigation: any = useNavigation();
  const route: any = useRoute();

  const order = state.order;
  const isOpened = state.bottomSheetOpened;

  useEffect(() => {
    if (order?.type !== 'Portal') {
      setState({
        ...state,
        order: {
          ...order,
          sum: 150,
          name: 'АМС',
        },
      });
    }
  }, []);

  const onSelect = (name: string, price: number) => {
    setState({
      ...state,
      order: {
        ...order,
        sum: price,
        name: name,
      },
    });
    navigation.navigate('Payment', route.params);
  };

  if (order?.type === 'Portal') {
    return (
      <BottomSheetScrollView
        contentContainerStyle={{
          ...styles.container,
          backgroundColor: theme.mainColor,
        }}
        nestedScrollEnabled={true}
        scrollEnabled={isOpened}>
        <View style={{paddingTop: dp(15)}} />
        <Text>{JSON.stringify(order)}</Text>
        <BusinessHeader
          navigation={navigation}
          position={'95%'}
          type="box"
          box={order?.box + 1}
          callback={() => {
            setState({
              ...state,
              order: {
                ...order,
                sum: null,
                name: null,
                box: null,
              },
            });
          }}
        />
        <ScrollView style={{paddingBottom: verticalScale(100)}}>
          {order.prices.map((price: Price, i: number) => (
            <View key={price.id}>
              <ExpandableView
                color={colors[i]}
                data={price}
                onSelect={() => onSelect(price.name, price.cost)}>
                <View style={{flexDirection: 'column', paddingBottom: dp(40)}}>
                  <Text
                    style={{
                      fontSize: dp(9),
                      fontWeight: '600',
                      color: '#000',
                      marginBottom: dp(10),
                    }}>
                    ВРЕМЯ МОЙКИ?
                  </Text>
                  <ActionButton
                    style={{
                      backgroundColor: '#0B68E1',
                    }}
                    textColor={'white'}
                    fontWeight={'600'}
                    width={horizontalScale(50)}
                    text={`${price.serviceDuration} мин.`}
                  />
                  <Text
                    style={{
                      fontSize: dp(9),
                      fontWeight: '600',
                      color: '#000',
                      marginTop: dp(10),
                      marginBottom: dp(10),
                    }}>
                    ЧТО ВХОДИТ?
                  </Text>
                  {price.serviceInfo.map((service, i) => (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#FFF',
                        fontWeight: '500',
                        backgroundColor: '#0B68E1',
                        fontSize: dp(10),
                        paddingTop: dp(3),
                        paddingBottom: dp(3),
                        borderRadius: dp(32),
                        maxWidth: dp(110),
                        marginBottom: dp(8),
                        paddingRight: dp(2),
                        paddingLeft: dp(2),
                      }}>
                      🚀 {service}
                    </Text>
                  ))}
                </View>
              </ExpandableView>
              {/*<PriceCard color="yellow" name={price.name} description={price.description} cost={price.cost} costType={price.costType} onSelect={onSelect} /> */}
            </View>
          ))}
        </ScrollView>
      </BottomSheetScrollView>
    );
  }
  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        ...styles.container,
        backgroundColor: theme.mainColor,
      }}
      nestedScrollEnabled={true}
      scrollEnabled={isOpened}>
      <View style={{paddingTop: dp(15)}} />
      <BusinessHeader
        navigation={navigation}
        position={'95%'}
        type="box"
        box={order?.box + 1}
        callback={() => {
          setState({
            ...state,
            order: {
              ...order,
              sum: null,
              name: null,
              box: null,
            },
          });
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: moderateScale(10),
              fontWeight: '400',
              lineHeight: verticalScale(20),
              paddingBottom: verticalScale(4),
            }}>
            Способ измерения
          </Text>
          <FilterList
            data={measureTypeData}
            width={horizontalScale(53)}
            backgroundColor={'#BFFA00'}
          />
        </View>

        <ActionButton
          width={horizontalScale(30)}
          height={verticalScale(30)}
          icon={'plus'}
          fontSize={moderateScale(22)}
          fontWeight={'400'}
          onClick={() => {
            if (value <= 980) {
              setValue(value + 20);
            }
          }}
        />
      </View>
      <View style={{...styles.sumSelector}}>
        <SumInput
          maxValue={1000}
          minValue={100}
          step={20}
          height={moderateVerticalScale(235)}
          width={moderateVerticalScale(235)}
          borderRadius={moderateScale(1000)}
          value={value}
          onChange={val => {
            setValue(val);
            setState({
              ...state,
              order: {
                ...order,
                sum: val,
                name: 'АМС',
              },
            });
          }}
          inputBackgroundColor={'#F5F5F5'}
          shadowProps={{
            shadowColor: '#E7E7E7',
            shadowRadius: 50,
            shadowOffset: {
              height: 4,
              width: 0,
            },
            shadowOpacity: 0.25,
          }}
        />
        <Text style={{...styles.sum}}>{value} ₽</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            display: 'flex',
            marginTop: verticalScale(35),
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <ActionButton
            style={{
              marginRight: horizontalScale(10),
              paddingTop: verticalScale(4),
              paddingBottom: verticalScale(4),
              paddingLeft: horizontalScale(10),
              paddingRight: horizontalScale(10),
            }}
            fontWeight={'600'}
            width={horizontalScale(60)}
            text={'150 р'}
            onClick={() => setValue(150)}
          />
          <ActionButton
            style={{
              marginRight: horizontalScale(10),
              paddingTop: verticalScale(4),
              paddingBottom: verticalScale(4),
              paddingLeft: horizontalScale(10),
              paddingRight: horizontalScale(10),
            }}
            fontWeight={'600'}
            width={horizontalScale(60)}
            text={'200 р'}
            onClick={() => setValue(200)}
          />
          <ActionButton
            style={{
              paddingTop: verticalScale(4),
              paddingBottom: verticalScale(4),
              paddingLeft: horizontalScale(10),
              paddingRight: horizontalScale(10),
            }}
            fontWeight={'600'}
            width={horizontalScale(60)}
            text={'250 р'}
            onClick={() => setValue(250)}
          />
        </View>
        <ActionButton
          style={{marginTop: verticalScale(30)}}
          width={horizontalScale(30)}
          height={verticalScale(30)}
          icon={'minus'}
          fontSize={moderateScale(22)}
          fontWeight={'400'}
          onClick={() => {
            if (value >= 120) {
              setValue(value - 20);
            }
          }}
        />
      </View>
      <View
        style={{
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flex: 1,
          paddingTop: dp(20),
          paddingBottom: dp(90),
        }}>
        <Button
          label="Оплатить"
          onClick={() => {
            navigation.navigate('Payment', route.params);
          }}
          color="blue"
        />
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: moderateScale(38),
    paddingLeft: horizontalScale(22),
    paddingRight: horizontalScale(22),
  },
  sumSelector: {
    borderRadius: moderateScale(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sum: {
    position: 'absolute',
    color: '#0B68E1',
    fontSize: moderateScale(30),
    fontWeight: '600',
    backgroundColor: '#F5F5F5',
    paddingRight: dp(15),
    paddingLeft: dp(15),
    paddingTop: dp(3),
    paddingBottom: dp(3),
    borderRadius: dp(32),
  },
});

export {Launch};
