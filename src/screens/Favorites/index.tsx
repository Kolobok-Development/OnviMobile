import {FlatList, SafeAreaView} from 'react-native';
import {dp} from '../../utils/dp';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/core';

import ScreenHeader from '@components/ScreenHeader';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {XStack, YStack} from 'tamagui';
import useSWRMutation from 'swr/mutation';
import {getPOSList} from '@services/api/pos/index.ts';
import calculateDistance from '@utils/calculateDistance.ts';
import {
  CarWashLocation,
  SortedCarWashLocation,
} from '@app-types/api/app/types.ts';
import {CarWashCard} from '@components/CarWashCard/CarWashCard.tsx';
import useStore from '@state/store.ts';

const Favorites = () => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Избранное'>>();
  const {t} = useTranslation();

  const [sortedData, setSortedData] = useState<SortedCarWashLocation[]>([]);

  const {location} = useStore.getState();

  const {trigger} = useSWRMutation(
    'getPOSList',
    (
      key,
      {
        arg,
      }: {
        arg: {
          [key: string]: string;
        };
      },
    ) => getPOSList(arg),
  );

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      trigger({}).then(res => {
        if (res?.businessesLocations?.length > 0) {
          const sortedCarwashes = res.businessesLocations.map(
            (carwash: CarWashLocation) => {
              const carwashLat = carwash.location.lat;
              const carwashLon = carwash.location.lon;
              const distance = calculateDistance(
                location.latitude,
                location.longitude,
                carwashLat,
                carwashLon,
              );

              const carWashWithDistance: SortedCarWashLocation = {
                ...carwash,
                distance,
              };

              return carWashWithDistance;
            },
          );

          // Sort by distance (ascending)
          sortedCarwashes.sort((a: any, b: any) => a.distance - b.distance);

          // Update state with the sorted and limited carwashes
          setSortedData(sortedCarwashes);
        }
      });
    }
  }, [location, trigger]);

  const onClick = () => {};

  const renderBusiness = ({item}: {item: SortedCarWashLocation}) => {
    return (
      <CarWashCard
        carWash={item}
        onClick={onClick}
        showHeart={true}
        isHeartActive={true}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <YStack flex={1} padding={dp(16)} flexDirection="column">
        <ScreenHeader
          screenTitle={t('navigation.favorites')}
          btnType="back"
          btnCallback={() => navigation.navigate('Главная')}
        />
        <XStack marginTop={dp(25)}>
          <FlatList
            data={sortedData}
            renderItem={renderBusiness}
            keyExtractor={(_, index: number) => index.toString()}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={{paddingBottom: dp(40)}}
            ItemSeparatorComponent={() => <XStack style={{height: 8}} />}
          />
        </XStack>
      </YStack>
    </SafeAreaView>
  );
};

export {Favorites};
