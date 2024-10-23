import React, {useState, useCallback, useEffect} from 'react';

import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {useRoute} from '@react-navigation/native';

//@ts-ignore
import {debounce} from 'lodash';

import {dp} from '../../../utils/dp';
import useStore from '../../../state/store';
import SearchPlaceholder from './SearchPlaceholder';
import {GeneralBottomSheetRouteProp} from 'src/types/BottomSheetNavigation';
import useSWRMutation from 'swr/mutation';
import {getPOSList} from '@services/api/pos';
import calculateDistance from '@utils/calculateDistance.ts';
import {
  CarWashLocation,
  SortedCarWashLocation,
} from '../../../types/api/app/types.ts';

const Search = () => {
  const [search, setSearch] = useState('');
  const route = useRoute<GeneralBottomSheetRouteProp<'Search'>>();

  const {setOrderDetails, setBusiness, location} = useStore.getState();

  const [sortedData, setSortedData] = useState<SortedCarWashLocation[]>([]);

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
      // Fetch carwashes
      trigger({}).then(res => {
        if (res?.businessesLocations?.length > 0) {
          // Calculate distance for each carwash
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

          // Limit to the 5 closest carwashes
          const top5Carwashes: SortedCarWashLocation[] = sortedCarwashes.slice(
            0,
            5,
          );

          // Update state with the sorted and limited carwashes
          setSortedData(top5Carwashes);
        }
      });
    }
  }, [location, trigger]);

  const renderBusiness = ({item}: {item: SortedCarWashLocation}) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onClick(item)}>
        <View style={styles.circleImageContainer}>
          <Image
            source={require('../../../assets/icons/small-icon.png')}
            style={styles.circleImage}
          />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.carwashes[0].name}</Text>
          <Text style={styles.text}>{item.carwashes[0].address}</Text>
          <Text style={styles.distanceText}>{`${item.distance.toFixed(
            2,
          )} km away`}</Text>
        </View>
      </TouchableOpacity>
    );
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

            const carWashWithDistance: SortedCarWashLocation = {
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
    route.params.bottomSheetRef?.current?.snapToPosition('42%');
    route.params.cameraRef.current.moveTo(
      [carwash.location.lon, carwash.location.lat],
      1,
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Поиск"
        maxLength={19}
        value={search}
        onChangeText={val => {
          setSearch(val);
          doSearch(val);
        }}
        style={{
          backgroundColor: 'rgba(245, 245, 245, 1)',
          borderRadius: dp(30),
          width: '100%',
          height: dp(40),
          paddingLeft: dp(18),
          textAlign: 'left',
          fontSize: dp(16),
          color: '#000000',
        }}
      />
      <View>
        {isMutating ? (
          <SearchPlaceholder />
        ) : (
          <>
            {!data ||
            !data.businessesLocations ||
            data.businessesLocations.length === 0 ? (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                }}>
                <Text style={{marginTop: dp(20), fontSize: dp(15)}}>
                  Мойки не найдены
                </Text>
              </View>
            ) : (
              <FlatList
                data={sortedData}
                renderItem={renderBusiness}
                keyExtractor={(item: CarWashLocation, index: number) =>
                  index.toString()
                }
                scrollEnabled={true}
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
  header: {
    alignItems: 'center',
  },
  list: {
    paddingLeft: dp(22),
  },
  headerTxt: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: '#000',
    fontSize: dp(24),
    fontWeight: '600',
  },
  //
  title: {
    fontSize: dp(15),
    fontWeight: '600',
    lineHeight: dp(20),
    color: '#000',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: dp(12),
    fontWeight: '400',
    lineHeight: dp(20),
    color: '#000',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dp(12),
    paddingHorizontal: dp(8),
  },
  circleImageContainer: {
    height: dp(25),
    width: dp(25),
    borderRadius: dp(28),
    overflow: 'hidden',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: dp(18),
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#F5F5F5',
    height: dp(70),
    display: 'flex',
    borderRadius: 22,
    padding: dp(14),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dp(5),
  },
  distanceText: {
    fontSize: dp(14),
    color: '#555',
    marginTop: 4,
  },
});

export {Search};
