import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

// styled components
import {Card} from '@styled/cards';
import useStore from '@state/store.ts';
import {BLACKTWO, WHITE, GREY, BLACK} from '@utils/colors.ts';
import {dp} from '@utils/dp.ts';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {Search} from 'react-native-feather';
// @ts-ignore
import Carousel from 'react-native-reanimated-carousel/src/Carousel.tsx';
import useSWR from 'swr';
import {getCampaignList} from '@services/api/campaign';
import {getNewsList} from '@services/api/news';
import CampaignPlaceholder from './CampaignPlaceholder';
import {GeneralBottomSheetRouteProp} from '../../../types/navigation/BottomSheetNavigation.ts';

import {Campaign} from '@app-types/api/app/types.ts';

import {getStoryView} from '@services/api/story-view';
import {StoryViewPlaceholder} from '@components/StoryView/StoryViewPlaceholder.tsx';

import {transformContentDataToUserStories} from '@shared/mappers/StoryViewMapper.ts';
import {StoryView} from '@components/StoryView';
import NearPosButton from './NearPosButton/index.tsx';
import PostsPlaceholder from './PostsPlaceholder/index.tsx';

const Main = () => {
  const {
    bottomSheetRef,
    setIsMainScreen,
    bottomSheetSnapPoints,
    setSelectedPos,
  } = useStore.getState();

  const route = useRoute<GeneralBottomSheetRouteProp<'Main'>>();

  // API Calls
  const {isLoading: campaignLoading, data: campaignData} = useSWR(
    ['getCampaignList'],
    () => getCampaignList('*'),
  );

  const {
    isLoading: newsLoading,
    data: newsData,
    error: newsError,
  } = useSWR(['getNewsList'], () => getNewsList('*'));

  const {
    isLoading: storyLoading,
    data: storyData,
    error: storyError,
  } = useSWR(['getStoryViw'], () => getStoryView('*'));

  useFocusEffect(
    useCallback(() => {
      setIsMainScreen(true);
      setSelectedPos(null);

      return () => {
        setIsMainScreen(false);
      };
    }, []),
  );

  const handleCampaignItemPress = (data: Campaign) => {
    navigateBottomSheet('Campaign', {
      data,
    });
  };

  const renderCampaignItem = useCallback(
    ({item}: {item: Campaign}) => (
      <TouchableOpacity
        onPress={() => handleCampaignItemPress(item)}
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
    ),
    [],
  );
  return (
    <BottomSheetScrollView
      contentContainerStyle={{flexGrow: 1}}
      nestedScrollEnabled={true}
      scrollEnabled={true}>
      <View style={{flexGrow: 1}}>
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
                bottomSheetRef?.current?.snapToPosition(
                  bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
                );
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
                bottomSheetRef?.current?.snapToPosition(
                  bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
                );
              }}>
              <Image
                source={require('../../../assets/icons/filterIcon.png')}
                style={{
                  width: dp(45),
                  height: dp(45),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <NearPosButton />
            <TouchableOpacity
              style={styles.partnersCard}
              onPress={() => {
                setTimeout(() => {
                  route.params.drawerNavigation.navigate('Промокоды');
                }, 100);
              }}>
              <View style={styles.label}>
                <Text
                  style={{color: WHITE, fontSize: dp(16), fontWeight: '700'}}>
                  Промокоды
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Card>
        <Card>
          {storyLoading || storyError ? (
            <StoryViewPlaceholder />
          ) : (
            <>
              {storyData && (
                <StoryView
                  stories={transformContentDataToUserStories(storyData)}
                />
              )}
            </>
          )}
          <View style={{...styles.newsRow}}>
            <Text
              style={{
                color: BLACK,
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
                  {newsData[0] && (
                    <View style={styles.leftNewsColumn}>
                      <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() =>
                          navigateBottomSheet('Post', {
                            data: newsData[0],
                          })
                        }>
                        <Image
                          source={{
                            uri: newsData[0].attributes.vertical_image.data
                              .attributes.url,
                          }}
                          style={styles.vertical}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.rightNewsColumn}>
                    {newsData[1] && (
                      <TouchableOpacity
                        onPress={() =>
                          navigateBottomSheet('Post', {
                            data: newsData[1],
                          })
                        }>
                        <Image
                          source={{
                            uri: newsData[1].attributes.horizontal_image.data
                              .attributes.url,
                          }}
                          style={styles.vertical}
                        />
                      </TouchableOpacity>
                    )}
                    {newsData[2] && (
                      <TouchableOpacity
                        onPress={() =>
                          navigateBottomSheet('Post', {
                            data: newsData[2],
                          })
                        }>
                        <Image
                          source={{
                            uri: newsData[2].attributes.horizontal_image.data
                              .attributes.url,
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
                    data={campaignData}
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
    paddingBottom: dp(8),
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
