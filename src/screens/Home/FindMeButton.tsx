import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-feather';
import {dp} from '../../utils/dp';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface FindMeButtonProps {
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
  onPress: () => void;
}

const BUTTON_SIZE = dp(40);
const BUTTON_MARGIN = dp(10);

const FindMeButton = ({animatedPosition, onPress}: FindMeButtonProps) => {
  const {height: SCREEN_HEIGHT} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const sheetTopPosition = animatedPosition.value;

    const bottomPosition = SCREEN_HEIGHT - sheetTopPosition + BUTTON_MARGIN;

    const minBottom = insets.bottom + 10;
    const safeBottomPosition = Math.max(minBottom, bottomPosition);

    return {
      bottom: safeBottomPosition,
    };
  });

  const opacityAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedPosition.value,
      [200, 300],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.findMeContainer,
        containerAnimatedStyle,
        opacityAnimatedStyle,
      ]}>
      <TouchableOpacity style={styles.findMe} onPress={onPress}>
        <Navigation fill="white" color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  findMeContainer: {
    position: 'absolute',
    right: dp(20),
    zIndex: 999, // Ensure it's above the bottom sheet
    // Add shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  findMe: {
    height: BUTTON_SIZE,
    width: BUTTON_SIZE,
    backgroundColor: '#000',
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // Add platform-specific styling
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },
});

export default FindMeButton;
