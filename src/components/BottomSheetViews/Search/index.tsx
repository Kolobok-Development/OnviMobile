import React, {useState, useCallback} from 'react';

import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {useAppState} from '@context/AppContext';
import {useRoute} from '@react-navigation/native';

//@ts-ignore
import {debounce} from 'lodash';

import {dp} from '../../../utils/dp';
import {useBusiness} from '../../../api/hooks/useAppContent';
import {CarWashLocation} from '../../../api/AppContent/types';

const Search = () => {
  const [search, setSearch] = useState('');
  const route: any = useRoute();

  const {state, setState} = useAppState();

  const {
    isLoading,
    isFetching,
    data,
    refetch: getBusinesses,
  } = useBusiness({search});

  const SearchPlaceholder = () => {
    return (
      <SkeletonPlaceholder borderRadius={4}>
        <View>
          <SkeletonPlaceholder.Item
            marginTop={dp(10)}
            width={'95%'}
            height={dp(50)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
          <SkeletonPlaceholder.Item
            width={'95%'}
            height={dp(50)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
          <SkeletonPlaceholder.Item
            width={'95%'}
            height={dp(50)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
        </View>
      </SkeletonPlaceholder>
    );
  };

  const renderBusiness = ({item}: {item: CarWashLocation}) => {
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
        </View>
      </TouchableOpacity>
    );
  };

  const doSearch = useCallback(
    debounce(async (val: string) => {
      await getBusinesses();
    }, 1300),
    [],
  );

  const onClick = (carwash: any) => {
    navigateBottomSheet('Business', carwash);
    setState({
      ...state,
      order: {},
    });
    route.params.bottomSheetRef.current?.snapToPosition('42%');
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
        {isLoading || isFetching ? (
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
                data={data.businessesLocations}
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
    fontSize: dp(16),
    fontWeight: '600',
    lineHeight: dp(20),
    color: '#000',
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
});

export {Search};
