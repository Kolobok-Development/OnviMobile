import React from 'react';

import { dp } from '../../utils/dp';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList, SafeAreaView, Platform
} from "react-native";
import {BurgerButton} from '@navigators/BurgerButton';
import {CheckBox} from '@styled/buttons/CheckBox';
import {useNavigation} from '@react-navigation/native';
import {usePartners} from '../../api/hooks/useAppContent';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Partner} from '../../api/AppContent/types';
import EmptyPlaceholder from '@components/EmptyPlaceholder';

const Partners = () => {
  const navigation = useNavigation<any>();

  const {isLoading, data: partnersData} = usePartners();

  const handlePartnerPress = (data: Partner) => {
    navigation.navigate('Партнер', {data: data});
  };

  const PartnersPlaceholder = () => {
    return (
      <SkeletonPlaceholder borderRadius={4}>
        <View>
          <SkeletonPlaceholder.Item
            marginTop={dp(30)}
            width={'100%'}
            height={dp(80)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={dp(80)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={dp(80)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
        </View>
      </SkeletonPlaceholder>
    );
  };

  const renderItem = ({item}: {item: Partner}) => {
    const partnerName = item?.attributes?.name ?? '';
    const partnerIconUrl =
      item?.attributes?.partner_icon.data.attributes.url ?? '';
    const partnerCategory = item?.attributes?.category ?? '';
    const partnerBonus = item?.attributes?.bonus ?? 0; // You might want to provide a default value

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          handlePartnerPress(item);
        }}>
        <View style={styles.circleImageContainer}>
          <Image source={{uri: partnerIconUrl}} style={styles.circleImage} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{partnerName}</Text>
          <Text style={styles.description}>Кэшбек на покупку от 2 500</Text>
          <CheckBox
            width={dp(94)}
            height={dp(24)}
            disable={true}
            borderRadius={dp(69)}
            backgroundColor={'#F5F5F5'}
            text={partnerCategory}
            textColor={'#000000'}
            fontSize={dp(10)}
            fontWeight={'500'}
            onClick={() => null}
          />
        </View>
        <Text style={styles.bonus}>{`${partnerBonus} %`}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BurgerButton isDrawerStack={true} />
          <Text style={styles.screenTitle}>Партнеры</Text>
        </View>
        {isLoading ? (
          <PartnersPlaceholder />
        ) : (
          <View style={styles.content}>
            <FlatList
              data={partnersData?.data}
              renderItem={renderItem}
              keyExtractor={(item: Partner) => item.id.toString()}
              ListEmptyComponent={() => (
                <View>
                  <EmptyPlaceholder text="Раздел находится в разработке. Пока что список партнеров пуст." />
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
  },
  screenTitle: {
    fontWeight: '600',
    fontSize: dp(24),
    marginLeft: dp(15),
    textAlignVertical: 'center',
    color: '#000',
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
  content: {
    marginTop: dp(30),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  circleImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28, // Half of width/height for a circle
    overflow: 'hidden', // Clip the image to the circle
    marginRight: 16,
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: dp(16),
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: dp(10),
    color: '#000',
    fontWeight: '400',
    marginBottom: dp(5),
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  bonus: {
    fontSize: dp(20),
    fontWeight: 'bold',
    color: '#000',
  },
});

export {Partners};
