import React from 'react';
import {TouchableOpacity, StyleSheet, Platform, Dimensions} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {Navigation} from 'react-native-feather';
import {dp} from '../../utils/dp';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface FindMeButtonProps {
  animatedPosition: Animated.SharedValue<number>;
  animatedIndex: Animated.SharedValue<number>;
  onPress: () => void;
}

// Button dimensions
const BUTTON_SIZE = dp(40);
const BUTTON_MARGIN = dp(30);

const FindMeButton = ({animatedPosition, onPress}: FindMeButtonProps) => {
  // Get screen dimensions and safe area insets
  const {height: SCREEN_HEIGHT} = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  // Create the animated style for the button
  const containerAnimatedStyle = useAnimatedStyle(() => {
    // Get the current position of the bottom sheet
    const sheetTopPosition = animatedPosition.value;

    // Calculate the button position to stay right above the sheet
    // Add a fixed margin to ensure it's always visible above the sheet
    const bottomPosition = SCREEN_HEIGHT - sheetTopPosition + BUTTON_MARGIN;

    // Make sure the button doesn't go below safe area
    const minBottom = Platform.OS === 'ios' ? insets.bottom + 10 : 20;
    const safeBottomPosition = Math.max(minBottom, bottomPosition);

    return {
      bottom: safeBottomPosition,
    };
  });

  const opacityAnimatedStyle = useAnimatedStyle(() => {
    // Calculate opacity based only on animatedPosition.value
    // We'll use fixed threshold values to determine when to fade

    // Assuming smaller values mean sheet is lower, larger values mean sheet is higher
    const opacity = interpolate(
      animatedPosition.value,
      [200, 300], // When position is between 200-400, fade out
      [0, 1], // From fully visible to invisible
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
    zIndex: 999,
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
