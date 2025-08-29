import React, {useCallback, useRef} from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';

import {useTranslation} from 'react-i18next';
import useStore from '@state/store.ts';
import {BLACKTWO, WHITE, BLACK} from '@utils/colors.ts';
import {dp} from '@utils/dp.ts';
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {useFocusEffect} from '@react-navigation/native';
import {Search} from 'react-native-feather';
import Carousel from 'react-native-reanimated-carousel';
import useSWR from 'swr';
import {getCampaignList} from '@services/api/campaign';
import {getNewsList} from '@services/api/news';
import CampaignPlaceholder from './CampaignPlaceholder';
import {useNavStore} from '@state/useNavStore/index.ts';
import {Campaign} from '@app-types/api/app/types.ts';
import {getStoryView} from '@services/api/story-view';
import {StoryViewPlaceholder} from '@components/StoryView/StoryViewPlaceholder.tsx';
import {transformContentDataToUserStories} from '@shared/mappers/StoryViewMapper.ts';
import {StoryView} from '@components/StoryView';
import NearPosButton from './NearPosButton/index.tsx';
import PostsPlaceholder from './PostsPlaceholder/index.tsx';
import {useCombinedTheme} from '@hooks/useCombinedTheme';
import {YStack, Text, Card, Image, XStack, Button} from 'tamagui';
import PressableCard from '@components/PressableCard/PressableCard.tsx';

const Main = () => {
  const {t} = useTranslation();
  const {bottomSheetRef, bottomSheetSnapPoints, setSelectedPos, setBusiness} =
    useStore.getState();

  const {setIsMainScreen} = useNavStore.getState();

  const {drawerNavigation} = useNavStore();
  const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null);
  const {backgroundColor, currentThemeName} = useCombinedTheme();

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
      setBusiness(null);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({y: 0, animated: false});
      }

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
      <PressableCard
        unstyled
        onPress={() => handleCampaignItemPress(item)}
        style={styles.campaigns}>
        <Image
          source={{uri: item.attributes.image.data.attributes.url}}
          style={{
            width: dp(340),
            height: dp(190),
            objectFit: 'contain',
          }}
        />
      </PressableCard>
    ),
    [],
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? dp(0) : dp(40),
      }}
      ref={scrollViewRef}
      nestedScrollEnabled={true}
      scrollEnabled={true}>
      <YStack style={{minHeight: '100%'}}>
        <Card
          theme={currentThemeName}
          backgroundColor={backgroundColor}
          padding={dp(16)}
          borderRadius={dp(22)}>
          <XStack verticalAlign="center" gap={dp(16)}>
            <XStack
              flex={1}
              backgroundColor="#D8D9DD"
              borderRadius={dp(25)}
              height={dp(45)}
              alignItems="center"
              onPress={() => {
                navigateBottomSheet('Search', {});
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
                color="#000"
                fontSize={dp(13)}
                fontWeight="600"
                opacity={0.15}
                marginLeft={dp(7)}
                flex={1}>
                {t('app.main.search')}
              </Text>
            </XStack>
            <Button
              unstyled
              onPress={() => {
                navigateBottomSheet('Filters', {});
                bottomSheetRef?.current?.snapToPosition(
                  bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
                );
              }}>
              <Image
                source={require('../../../assets/icons/filterIcon.png')}
                width={dp(45)}
                height={dp(45)}
              />
            </Button>
          </XStack>
          <XStack gap={dp(16)} marginTop={dp(16)}>
            <NearPosButton />

            <PressableCard
              backgroundColor={BLACKTWO}
              borderRadius={dp(22)}
              height={dp(90)}
              width={'48%'}
              flex={1}
              onPress={() => {
                drawerNavigation?.navigate('Промокоды');
              }}>
              <YStack alignItems="flex-start" padding={dp(16)} height="100%">
                <Text
                  color={WHITE}
                  fontSize={dp(16)}
                  fontWeight="700"
                  textAlign="center">
                  {t('navigation.promos')}
                </Text>
              </YStack>
            </PressableCard>
          </XStack>
        </Card>
        <Card
          backgroundColor={backgroundColor}
          padding={dp(16)}
          borderRadius={38}
          flex={1}
          marginTop={dp(8)}>
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
          <XStack justifyContent={'space-between'}>
            <Text
              color={BLACK}
              fontSize={dp(24)}
              fontWeight="600"
              marginTop={dp(16)}>
              {t('app.main.PromotionsForYou')}
            </Text>
          </XStack>
          <YStack flex={1} marginTop={dp(12)}>
            {campaignLoading ? (
              <CampaignPlaceholder />
            ) : (
              <XStack flex={1}>
                {campaignData && (
                  <Carousel
                    loop
                    vertical={false}
                    width={dp(350)}
                    height={dp(200)}
                    enabled
                    autoPlay={true}
                    autoPlayInterval={3000}
                    data={campaignData}
                    pagingEnabled={true}
                    renderItem={renderCampaignItem}
                  />
                )}
              </XStack>
            )}
          </YStack>
          <XStack justifyContent={'space-between'}>
            <Text
              color={BLACK}
              fontSize={dp(24)}
              fontWeight="600"
              marginTop={dp(12)}>
              {t('app.main.freshNews')}
            </Text>
          </XStack>
          <XStack marginTop={dp(12)}>
            {newsLoading || newsError ? (
              <PostsPlaceholder />
            ) : (
              <>
                {newsData && (
                  <XStack
                    flexWrap="wrap"
                    justifyContent="space-between"
                    gap={dp(11)}>
                    {newsData.map((newsItem, index) => (
                      <PressableCard
                        key={newsItem.id || index}
                        width="48%"
                        aspectRatio={1}
                        borderRadius={dp(23)}
                        overflow="hidden"
                        onPress={() =>
                          navigateBottomSheet('Post', {data: newsItem})
                        }>
                        <Image
                          source={{
                            uri:
                              newsItem.attributes.vertical_image?.data
                                ?.attributes?.url ||
                              newsItem.attributes.horizontal_image?.data
                                ?.attributes?.url,
                          }}
                          width="100%"
                          height="100%"
                        />
                      </PressableCard>
                    ))}
                  </XStack>
                )}
              </>
            )}
          </XStack>
        </Card>
      </YStack>
    </BottomSheetScrollView>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  campaigns: {
    width: width,
    justifyContent: 'center',
  },
});

export {Main};
