import {StyleSheet, Text, View} from 'react-native';

// state
import useStore from '../../../../state/store';

// components
import {BusinessHeader} from '@components/Business/Header';
import {ActionButton} from '@styled/buttons/ActionButton';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {ExpandableView} from '@styled/views/ExpandableView';

import {ScrollView} from 'react-native-gesture-handler';

// utils
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../../utils/metrics';
import {useTheme} from '@context/ThemeProvider';
import {dp} from '../../../../utils/dp';

// types


interface PortalLaunchProps {
  isOpened: boolean;
  onSelect: (name: string, price: number) => void;
}

export default function PortalLaunch({isOpened, onSelect}: PortalLaunchProps) {
  const {orderDetails} = useStore();

  const colors: Array<'yellow' | 'blue' | 'grey' | 'black'> = [
    'yellow',
    'blue',
    'grey',
    'black',
  ];

  const {theme} = useTheme();

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        ...styles.container,
        backgroundColor: theme.mainColor,
      }}
      nestedScrollEnabled={true}
      scrollEnabled={isOpened}>
      <View style={{paddingTop: dp(15)}} />
      <BusinessHeader type="box" box={orderDetails?.bayNumber ?? 0} />
      <ScrollView style={{paddingBottom: verticalScale(100)}}>
        {orderDetails &&
          orderDetails.prices &&
          orderDetails.prices.length &&
          orderDetails.prices?.map((price: Price, indPrice: number) => (
            <View key={price.id}>
              <ExpandableView
                color={colors[indPrice]}
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
                  {price.serviceInfo.map((service, indService) => (
                    <Text
                      key={'service-' + indService}
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
            </View>
          ))}
      </ScrollView>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: moderateScale(38),
    paddingLeft: horizontalScale(22),
    paddingRight: horizontalScale(22),
  },
});
