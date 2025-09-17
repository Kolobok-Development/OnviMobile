import {getNewsList} from '@services/api/news';
import useSWRInfinite from 'swr/infinite';
import PressableCard from '@components/PressableCard/PressableCard';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {Image, XStack, Spinner} from 'tamagui';
import {dp} from '@utils/dp';
import {FlatList, View} from 'react-native';

const NewsList = () => {
  const PAGE_SIZE = 4;

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.data.length) {
      return null;
    }
    return ['getNewsList', pageIndex + 1, PAGE_SIZE];
  };

  const {data, error, size, setSize} = useSWRInfinite(
    getKey,
    ([_, page, pageSize]) => getNewsList('*', Number(page), Number(pageSize)),
    {revalidateFirstPage: false},
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.length < PAGE_SIZE);

  const loadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <PressableCard
      width="48%"
      aspectRatio={1}
      borderRadius={dp(23)}
      overflow="hidden"
      onPress={() => navigateBottomSheet('Post', {data: item})}>
      <Image
        source={{
          uri:
            item.attributes.vertical_image?.data?.attributes?.url ||
            item.attributes.horizontal_image?.data?.attributes?.url,
        }}
        width="100%"
        height="100%"
      />
    </PressableCard>
  );

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <View style={{padding: dp(20)}}>
        <Spinner size="large" color="$blue10" />
      </View>
    );
  };

  const newsData = data?.flatMap(page => page.data) || [];

  return (
    <>
      {isLoadingInitialData ? (
        <Spinner size="large" color="$blue10" />
      ) : (
        <FlatList
          data={newsData}
          renderItem={renderItem}
          keyExtractor={(item, index) => String(item.id || index)}
          numColumns={2}
          columnWrapperStyle={{gap: dp(11)}}
          scrollEnabled={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{paddingTop: dp(12), paddingBottom: dp(40)}}
          ItemSeparatorComponent={() => <XStack style={{height: dp(11)}} />}
        />
      )}
    </>
  );
};

export {NewsList};
