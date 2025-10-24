import React, {useCallback} from 'react';
import {StyleSheet, Dimensions, FlatList} from 'react-native';
import {horizontalScale} from '../../../utils/metrics';
import {dp} from '../../../utils/dp';
import {Box} from '@components/Boxes/Box';
import useStore from '../../../state/store';
import BoxSkeleton from '../BoxSkeleton';

const width = Dimensions.get('window').width;

interface BoxItem {
  isFree: boolean;
  status: string;
  id: string;
  number: number;
}

interface BoxesSlideProps {
  boxes: BoxItem[];
  navigation: any;
  params: any;
  loading?: boolean;
}

const BoxesSlide = ({
  boxes = [],
  navigation,
  params,
  loading = false,
}: BoxesSlideProps) => {
  const {orderDetails, setOrderDetails, bottomSheetRef, bottomSheetSnapPoints} =
    useStore.getState();

  const contentPadding = (width - horizontalScale(92) * boxes.length) / 2;

  const handleBoxPress = useCallback(
    (boxNumber: number, isFree: boolean) => {
      if (!isFree) {
        return;
      }

      setOrderDetails({
        ...orderDetails,
        bayNumber: boxNumber,
      });

      bottomSheetRef?.current?.snapToPosition(
        bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
      );

      navigation.navigate('Launch', {bayType: params.bayType});
    },
    [
      orderDetails,
      setOrderDetails,
      bottomSheetRef,
      bottomSheetSnapPoints,
      navigation,
      params,
    ],
  );

  const renderBoxItem = useCallback(
    ({item}: {item: BoxItem}) => (
      <Box
        label={item?.number?.toString()}
        onClick={() => handleBoxPress(item.number, item.isFree)}
        active={orderDetails.bayNumber === item.number}
        isFree={item.isFree}
        disabled={!item.isFree}
        showBorder={true}
      />
    ),
    [handleBoxPress, orderDetails.bayNumber],
  );

  const renderSkeletonItem = useCallback(
    ({index}: {index: number}) => <BoxSkeleton key={`skeleton-${index}`} />,
    [],
  );

  // Если идет загрузка, показываем скелетоны
  if (loading) {
    return (
      <FlatList
        data={boxes}
        renderItem={renderSkeletonItem}
        keyExtractor={(item, index) => `skeleton-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          {
            paddingLeft: contentPadding,
            paddingRight: contentPadding,
          },
        ]}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        getItemLayout={(data, index) => ({
          length: dp(94.4),
          offset: dp(94.4) * index,
          index,
        })}
      />
    );
  }

  return (
    <FlatList
      data={boxes}
      renderItem={renderBoxItem}
      keyExtractor={(item, index) => `box-${item.number}-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        {
          paddingLeft: contentPadding,
          paddingRight: contentPadding,
        },
      ]}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={3}
      getItemLayout={(data, index) => ({
        length: dp(94.4),
        offset: dp(94.4) * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {BoxesSlide};
