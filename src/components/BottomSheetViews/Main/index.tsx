import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// styled components
import {Card} from '@styled/cards';

import {useAuth} from '@context/AuthContext';

import {useTheme} from '@context/ThemeProvider';

import {BLUE, BLACKTWO, WHITE, GREY} from '../../../utils/colors';

import {dp} from '../../../utils/dp';

import {useAxios} from '@hooks/useAxios';
import {useAppState} from '@context/AppContext';

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import {useRoute} from '@react-navigation/native';

import {Search} from 'react-native-feather';
import {useCampaigns, useNewsPosts} from '../../../api/hooks/useAppContent';
import {Campaign} from '../../../api/AppContent/types';
import Carousel from 'react-native-reanimated-carousel/src/Carousel.tsx';
import {useIsFocused} from '@react-navigation/core';
import calculateDistance from '@utils/calculateDistance.ts';
import Geolocation from '@react-native-community/geolocation';
import { CustomModal } from "@styled/views/CustomModal";

const WIDTH = Dimensions.get('screen').width;

const Main = ({drawerNavigation}: any) => {
  const {user}: any = useAuth();
  const {theme}: any = useTheme();
  const route: any = useRoute();

  const {state} = useAppState();

  const isOpened = state.bottomSheetOpened;

  const {isLoading: campaignLoading, data: campaignData} = useCampaigns();

  const {
    isLoading: newsLoading,
    data: newsData,
    error: newsError,
  } = useNewsPosts();

  const api = useAxios('CORE_URL');

  const updateInfo = async () => {
    const data = await api
      .get('/account/me')
      .then(data => {})
      .catch(err => console.log(err.response));
  };

  // UPDATE BALANCE
  const {loadUser}: any = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadUser();
    }
  }, [isFocused]);

  //Near by carwash
  const [nearestCarWash, setNearestCarWash] = useState(null);
  const businesses = state.businesses;
  const userLocation = state.userLocation;
  const [nearByModal, setNearByModal] = useState(false)

  const findNearestCarWash = () => {
    if (!userLocation) {
      return;
    }

    if (!businesses) {
      return;
    }

    let nearest = null;
    let minDistance = Infinity;

    businesses.forEach(carWash => {
      const cwLat = carWash.location.lat;
      const cwLon = carWash.location.lon;
      const distance = calculateDistance(
        userLocation.longitude,
        userLocation.latitude,
        cwLon,
        cwLat,
      );
      if (distance < minDistance && distance <= 0.5) {
        minDistance = distance;
        nearest = carWash;
      }
    });
    setNearestCarWash(nearest);
  };

  useEffect(() => {
    console.log(`NEARSETS: ${JSON.stringify(nearestCarWash)}`);
    findNearestCarWash();
  }, [state]);

  const handleLaunchCarWash = () => {
    if (nearestCarWash) {
      // Launch car wash logic here
      navigateBottomSheet('Business', nearestCarWash);
    } else {
      setNearByModal(true);
    }
  };

  const PostsPlaceholder = () => {
    return (
      <View>
        <SkeletonPlaceholder borderRadius={4}>
          <View style={styles.news}>
            <View style={styles.leftNewsColumn}>
              <SkeletonPlaceholder.Item
                flex={1}
                borderWidth={26}
                marginTop={dp(16)}
              />
            </View>
            <View style={styles.rightNewsColumn}>
              <SkeletonPlaceholder.Item
                flex={1}
                marginTop={dp(16)}
                borderRadius={25}
                minHeight={dp(120)}
              />
              <SkeletonPlaceholder.Item
                flex={1}
                marginTop={dp(16)}
                borderRadius={25}
                minHeight={dp(120)}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  };

  const CampaignPlaceholder = () => {
    return (
      <View>
        <SkeletonPlaceholder borderRadius={4}>
          <View>
            <SkeletonPlaceholder.Item
              marginTop={dp(16)}
              width={'100%'}
              height={dp(180)}
              borderRadius={dp(25)}
              alignSelf="center"
            />
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  };

  const BalancePlaceHolder = () => {
    return (
      <SkeletonPlaceholder borderRadius={10}>
        <View
          style={{
            width: dp(70),
            height: dp(25),
          }}
        />
      </SkeletonPlaceholder>
    );
  };

  const handleCampaignItemPress = (data: Campaign) => {
    navigateBottomSheet('Campaign', {
      data,
    });
  };

  const renderCampaignItem = ({item}: {item: Campaign}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleCampaignItemPress(item);
        }}
        style={styles.campaigns}>
        <Image
          source={{uri: item.attributes.image.data.attributes.url}}
          style={{
            width: dp(340),
            height: dp(190),
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetScrollView
      contentContainerStyle={{flexGrow: 1}}
      nestedScrollEnabled={true}
      scrollEnabled={isOpened}>
      <View style={{flexGrow: 1}}>
        <CustomModal isVisible={nearByModal} text={'К сожалению, поблизости не удалось найти автомойку 🚗'} onClick={() => setNearByModal(false)} btnText={'Закрыть'} />
        <Card>
          <View style={{...styles.row, marginBottom: dp(16)}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#D8D9DD',
                flex: 1,
                borderRadius: dp(25),
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => {
                navigateBottomSheet('Search', {
                  type: 'search',
                });
                route.params.bottomSheetRef.current?.snapToPosition('95%');
              }}>
              <Search
                stroke={'#000000'}
                width={dp(20)}
                height={dp(20)}
                style={{marginLeft: dp(15)}}
              />
              <Text
                style={{
                  color: '#000',
                  fontSize: dp(13),
                  fontWeight: '600',
                  opacity: 0.15,
                  paddingLeft: dp(7),
                }}>
                Поиcк
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigateBottomSheet('Filters', {});
                route.params.bottomSheetRef.current?.snapToPosition('95%');
              }}>
              <Image
                source={require('../../../assets/icons/filterIcon.png')}
                style={{
                  width: dp(45),
                  height: dp(45),
                  resizeMode: 'contain',
                }}
                //Change your icon image here
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.balanceCard}
              onPress={() => {
                handleLaunchCarWash()
              }}>
              <View style={styles.label}>
                <Text
                  style={{color: WHITE, fontSize: dp(16), fontWeight: '700'}}>
                  Запустить
                </Text>
              </View>
              <View style={styles.info}>
                <Text
                  onPress={updateInfo}
                  style={{
                    fontSize: dp(12),
                    fontWeight: '700',
                    color: 'white',
                    letterSpacing: 0.2,
                  }}>
                  {nearestCarWash ? `${nearestCarWash.carwashes[0].name}` : ''}
                </Text>
                <Image
                  source={require('../../../assets/icons/small-icon.png')}
                  style={{width: 30, height: 30}}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.partnersCard}
              onPress={() => {
                route.params.drawerNavigation.navigate('Партнеры');
              }}>
              <View style={styles.label}>
                <Text
                  style={{color: WHITE, fontSize: dp(16), fontWeight: '700'}}>
                  Партнеры
                </Text>
              </View>
              <View style={{...styles.info, justifyContent: 'flex-start'}}>
                <Image
                  source={require('../../../assets/icons/magnitIcon.png')}
                  style={{width: dp(32), height: dp(32), marginRight: dp(10)}}
                />
                <Image
                  source={require('../../../assets/icons/dodoIcon.png')}
                  style={{width: dp(32), height: dp(32), marginRight: dp(10)}}
                />
                <Image
                  source={require('../../../assets/icons/OgonIcon.png')}
                  style={{width: dp(32), height: dp(32)}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Card>
        <Card>
          <View style={{...styles.newsRow}}>
            <Text
              style={{
                color: theme.textColor,
                fontSize: dp(24),
                fontWeight: '600',
              }}>
              Свежие новости
            </Text>
          </View>
          {newsLoading || newsError ? (
            <PostsPlaceholder />
          ) : (
            <>
              {newsData && (
                <View style={styles.news}>
                  {newsData.data[0] && (
                    <View style={styles.leftNewsColumn}>
                      <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() =>
                          navigateBottomSheet('Post', {
                            data: newsData.data[0],
                          })
                        }>
                        <Image
                          source={{
                            uri: newsData.data[0].attributes.vertical_image.data
                              .attributes.url,
                          }}
                          style={styles.vertical}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.rightNewsColumn}>
                    {newsData.data[1] && (
                      <TouchableOpacity
                        onPress={() =>
                          navigateBottomSheet('Post', {
                            data: newsData.data[1],
                          })
                        }>
                        <Image
                          source={{
                            uri: newsData.data[1].attributes.horizontal_image
                              .data.attributes.url,
                          }}
                          style={styles.vertical}
                        />
                      </TouchableOpacity>
                    )}
                    {newsData.data[2] && (
                      <TouchableOpacity
                        onPress={() =>
                          navigateBottomSheet('Post', {
                            data: newsData.data[2],
                          })
                        }>
                        <Image
                          source={{
                            uri: newsData.data[2].attributes.horizontal_image
                              .data.attributes.url,
                          }}
                          style={styles.vertical}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
          <View style={{flex: 1, paddingBottom: dp(50), marginTop: dp(10)}}>
            {campaignLoading ? (
              <CampaignPlaceholder />
            ) : (
              <View style={{flex: 1}}>
                {campaignData && (
                  <Carousel
                    loop
                    vertical={false}
                    width={dp(350)}
                    height={dp(200)}
                    enabled // Default is true, just for demo
                    //defaultScrollOffsetValue={scrollOffsetValue}
                    autoPlay={true}
                    autoPlayInterval={3000}
                    data={campaignData.data}
                    pagingEnabled={true}
                    renderItem={renderCampaignItem}
                  />
                )}
              </View>
            )}
          </View>
        </Card>
      </View>
    </BottomSheetScrollView>
  );
};

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('screen').height,
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: dp(16),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  balanceCard: {
    backgroundColor: BLUE,
    borderRadius: 22,
    height: dp(90),
    flex: 1,
    marginRight: dp(8),
    flexDirection: 'column',
    padding: dp(16),
  },
  partnersCard: {
    backgroundColor: BLACKTWO,
    borderRadius: 22,
    height: dp(90),
    flex: 1,
    marginLeft: dp(8),
    flexDirection: 'column',
    padding: dp(16),
  },
  label: {
    paddingBottom: dp(10),
  },
  info: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  news: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: dp(280),
  },
  leftNewsColumn: {
    flex: 1,
  },
  rightNewsColumn: {
    flex: 2,
    marginLeft: dp(8),
  },
  searchInput: {
    backgroundColor: GREY,
    borderRadius: dp(25),
    height: dp(45),
    alignSelf: 'stretch',
    textAlign: 'left',
    padding: dp(5),
    color: '#000000',
  },
  vertical: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 25,
    marginTop: dp(16),
    padding: dp(8),
    minHeight: dp(120),
  },
  campaigns: {
    width: width,
    justifyContent: 'center',
  },
});

export {Main};
