import React, {useState} from 'react';
import {dp} from '@utils/dp';
import {Button, Image, Text, XStack, YStack} from 'tamagui';
import {SortedCarWashLocation} from '@app-types/api/app/types';
import useStore from '@state/store';
import {StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';

interface CarWashCardProps {
  carWash: SortedCarWashLocation;
  onClick?: (carWash: SortedCarWashLocation) => void;
  showDistance?: boolean;
  showClip?: boolean;
  showHeart?: boolean;
  heartIsClickable?: boolean;
  showBorder?: boolean;
  showActionModal?: boolean;
}

const CarWashCard = ({
  carWash,
  onClick,
  showDistance = true,
  showClip = false,
  showHeart = true,
  heartIsClickable = false,
  showBorder = true,
  showActionModal = false,
}: CarWashCardProps) => {
  const {addToFavorites, removeFromFavorites, isFavorite} = useStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const isHeartActive = isFavorite(Number(carWash.carwashes[0].id));

  const handleHeartPress = () => {
    try {
      if (isHeartActive) {
        removeFromFavorites(Number(carWash.carwashes[0].id));
      } else {
        addToFavorites(Number(carWash.carwashes[0].id));
      }
    } catch (error) {}
    setMenuVisible(false);
  };

  const handleLongPress = () => {
    if (showActionModal) {
      setMenuVisible(true);
    }
  };

  const handleCardPress = () => {
    onClick?.(carWash);
  };

  const closeModal = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <Button
        height={showDistance ? dp(63) : dp(46)}
        padding={10}
        borderRadius={12}
        borderWidth={showBorder ? 1 : 0}
        borderColor="#E2E2E2"
        justifyContent="flex-start"
        onPress={handleCardPress}
        onLongPress={handleLongPress}>
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
            onPress={() => {
              if (heartIsClickable) {
                handleHeartPress();
              }
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

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <XStack style={styles.modalOverlay}>
            <XStack style={styles.overlayBackground} />
          </XStack>
        </TouchableWithoutFeedback>

        <XStack style={styles.modalContent}>
          <TouchableWithoutFeedback>
            <YStack style={styles.contextMenu}>
              <Button
                unstyled
                onPress={handleHeartPress}
                style={styles.menuButton}>
                <XStack
                  padding={dp(15)}
                  backgroundColor="white"
                  borderRadius={dp(12)}
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  gap={dp(6)}>
                  <Text fontSize={dp(13)} color="#333" fontWeight="500">
                    {isHeartActive
                      ? 'Удалить из избранного'
                      : 'Добавить в избранное'}
                  </Text>
                  <Image
                    source={
                      isHeartActive
                        ? require('../../assets/icons/heart-active.png')
                        : require('../../assets/icons/heart.png')
                    }
                    width={20}
                    height={20}
                  />
                </XStack>
              </Button>

              <Button unstyled onPress={closeModal} style={styles.closeButton}>
                <XStack
                  padding={dp(15)}
                  backgroundColor="white"
                  borderRadius={dp(12)}
                  alignItems="center"
                  justifyContent="center"
                  width="100%">
                  <Text fontSize={dp(13)} color="#FF3B30" fontWeight="500">
                    Отмена
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </TouchableWithoutFeedback>
        </XStack>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: dp(20),
    zIndex: 1000,
  },
  contextMenu: {
    width: '100%',
    gap: dp(10),
  },
  menuButton: {
    width: '100%',
  },
  closeButton: {
    width: '100%',
    marginTop: dp(5),
  },
});

export {CarWashCard};
