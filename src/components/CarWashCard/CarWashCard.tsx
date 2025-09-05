import React from 'react';
import {dp} from '@utils/dp';
import {Button, Image, Text, XStack, YStack} from 'tamagui';
import {SortedCarWashLocation} from '@app-types/api/app/types';
import useStore from '@state/store';

interface CarWashCardProps {
  carWash: SortedCarWashLocation;
  onClick?: (carWash: SortedCarWashLocation) => void;
  showDistance?: boolean;
  showClip?: boolean;
  showHeart?: boolean;
  showBorder?: boolean;
}

const CarWashCard = ({
  carWash,
  onClick,
  showDistance = true,
  showClip = false,
  showHeart = false,
  showBorder = true,
}: CarWashCardProps) => {
  const {addToFavorites, removeFromFavorites, isFavorite} = useStore();

  const isHeartActive = isFavorite(Number(carWash.carwashes[0].id));

  const handleHeartPress = () => {
    if (isHeartActive) {
      removeFromFavorites(Number(carWash.carwashes[0].id));
    } else {
      addToFavorites(Number(carWash.carwashes[0].id));
    }
  };

  return (
    <Button
      height={showDistance ? dp(63) : dp(46)}
      padding={10}
      borderRadius={12}
      borderWidth={showBorder ? 1 : 0}
      borderColor="#E2E2E2"
      justifyContent="flex-start"
      onPress={() => onClick?.(carWash)}>
      <XStack flex={1} alignItems="center" gap={dp(8)}>
        <Image
          source={require('../../assets/icons/small-icon.png')}
          width={18}
          height={18}
        />
        <YStack paddingRight={dp(15)}>
          <Text fontSize={13} ellipsizeMode="tail" numberOfLines={1}>
            {carWash.carwashes[0].name}
          </Text>
          <Text
            fontSize={12}
            color={'#6F6F6F'}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {carWash.carwashes[0].address}
          </Text>
          {showDistance && (
            <Text
              fontSize={12}
              color={'#6F6F6F'}
              ellipsizeMode="tail"
              numberOfLines={1}>
              {`${carWash.distance.toFixed(2)} km away`}
            </Text>
          )}
        </YStack>
      </XStack>

      {showClip && (
        <Button unstyled>
          <Image
            source={require('../../assets/icons/clip.png')}
            width={20}
            height={20}
          />
        </Button>
      )}

      {showHeart && (
        <Button
          unstyled
          onPress={e => {
            e.stopPropagation();
            handleHeartPress();
          }}>
          <Image
            source={
              isHeartActive
                ? require('../../assets/icons/heart-active.png')
                : require('../../assets/icons/heart.png')
            }
            width={20}
            height={20}
          />
        </Button>
      )}
    </Button>
  );
};

export {CarWashCard};
