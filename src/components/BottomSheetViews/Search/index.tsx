import React, {useState, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {View, StyleSheet, TextInput, Text} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';

//@ts-ignore
import {debounce} from 'lodash';

import {dp} from '@utils/dp';
import useStore from '@state/store';
import SearchPlaceholder from './SearchPlaceholder';

import useSWRMutation from 'swr/mutation';
import {getPOSList} from '@services/api/pos';
import calculateDistance from '@utils/calculateDistance.ts';
import {CarWashLocation} from '@app-types/api/app/types.ts';
import {CarWashCard} from '@components/CarWashCard/CarWashCard';

const Search = () => {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');

  const {setOrderDetails, setBusiness, location, bottomSheetRef, cameraRef} =
    useStore.getState();

  const [sortedData, setSortedData] = useState<CarWashLocation[]>([]);

  const {isMutating, trigger, data} = useSWRMutation(
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

              const carWashWithDistance: CarWashLocation = {
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

  const renderBusiness = ({item}: {item: CarWashLocation}) => {
    return <CarWashCard carWash={item} onClick={onClick} />;
  };

  const doSearch = useCallback(
    debounce(async (val: string) => {
      const res = await trigger({search: val});

      if (res?.businessesLocations?.length > 0) {
        const searchResults = res.businessesLocations.map(
          (carwash: CarWashLocation) => {
            const carwashLat = carwash.location.lat;
            const carwashLon = carwash.location.lon;
            const distance = calculateDistance(
              location?.latitude,
              location?.longitude,
              carwashLat,
              carwashLon,
            );

            const carWashWithDistance: CarWashLocation = {
              ...carwash,
              distance,
            };

            return carWashWithDistance;
          },
        );

        // Sort by distance (if needed, based on user location)
        searchResults.sort((a: any, b: any) => a.distance - b.distance);

        // Update the search results state (no limit)
        setSortedData(searchResults);
      }
    }, 1300),
    [location, trigger],
  );

  const onClick = (carwash: any) => {
    navigateBottomSheet('Business', {});
    setBusiness(carwash);
    setOrderDetails({
      posId: 0,
      sum: 0,
      bayNumber: null,
      promoCodeId: null,
      rewardPointsUsed: null,
      type: null,
      name: null,
      prices: [],
      order: null,
      orderDate: null,
    });
    bottomSheetRef?.current?.snapToPosition('42%');

    cameraRef?.current?.setCameraPosition({
      longitude: carwash.location.lon,
      latitude: carwash.location.lat,
      zoomLevel: 16,
      animationDuration: 1000,
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('app.search.placeholder')}
        maxLength={19}
        value={search}
        onChangeText={val => {
          setSearch(val);
          doSearch(val);
        }}
        style={styles.input}
      />
      <View style={styles.flexContainer}>
        {isMutating ? (
          <SearchPlaceholder />
        ) : (
          <>
            {!data ||
            !data.businessesLocations ||
            data.businessesLocations.length === 0 ? (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>
                  {t('app.search.washesNotFound')}
                </Text>
              </View>
            ) : (
              <BottomSheetFlatList
                data={sortedData}
                renderItem={renderBusiness}
                keyExtractor={(item: CarWashLocation, index: number) =>
                  index.toString()
                }
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={styles.listContentContainer}
                ItemSeparatorComponent={() => <View style={{height: 8}} />}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: dp(15),
    paddingLeft: dp(15),
    paddingRight: dp(15),
    borderRadius: dp(38),
  },
  input: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderRadius: dp(30),
    width: '100%',
    height: dp(40),
    paddingLeft: dp(18),
    textAlign: 'left',
    fontSize: dp(16),
    color: '#000000',
  },
  flexContainer: {
    flex: 1,
  },
  notFoundContainer: {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  notFoundText: {
    marginTop: dp(20),
    fontSize: dp(15),
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  listContentContainer: {
    paddingTop: dp(8),
    paddingBottom: dp(40), // Add padding at the bottom of the list
  },
});

export {Search};
