import {FlatList, SafeAreaView} from 'react-native';
import {dp} from '@utils/dp';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/core';
import ScreenHeader from '@components/ScreenHeader';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {XStack, YStack} from 'tamagui';
import calculateDistance from '@utils/calculateDistance.ts';
import {CarWashLocation} from '@app-types/api/app/types.ts';
import {CarWashCard} from '@components/CarWashCard/CarWashCard.tsx';
import useStore from '@state/store.ts';

const Favorites = () => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Избранное'>>();
  const {t} = useTranslation();
  const [sortedData, setSortedData] = useState<CarWashLocation[]>([]);
  const {location, posList, favorites} = useStore.getState();

  useEffect(() => {
    if (
      location?.latitude &&
      location?.longitude &&
      posList.length > 0 &&
      favorites.length > 0
    ) {
      const favoriteCarWashes = posList.filter(carwash =>
        favorites.includes(Number(carwash.carwashes[0].id)),
      );

      const favoriteCarWashesDistance = favoriteCarWashes.map(carwash => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          carwash.location.lat,
          carwash.location.lon,
        );

        const carWashWithDistance = {
          ...carwash,
          distance,
        };

        return carWashWithDistance;
      });

      setSortedData(favoriteCarWashesDistance);
    }
  }, [location, posList, favorites]);

  const renderBusiness = ({item}: {item: CarWashLocation}) => {
    return <CarWashCard carWash={item} showIsFavorite={true} />;
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
