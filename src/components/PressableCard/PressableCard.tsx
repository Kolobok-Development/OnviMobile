import React, {useRef} from 'react';
import {Animated, DimensionValue, PanResponder} from 'react-native';
import {Card, CardProps, XStack} from 'tamagui';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface PressableCardProps extends CardProps {
  onPress?: () => void;
  children: React.ReactNode;
  hapticType?:
    | 'selection'
    | 'impactLight'
    | 'impactMedium'
    | 'impactHeavy'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError';
  enableHaptic?: boolean;
}

const PressableCard = ({
  onPress,
  children,
  hapticType = 'impactMedium',
  enableHaptic = true,
  ...props
}: PressableCardProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const triggerHaptic = () => {
    if (enableHaptic) {
      ReactNativeHapticFeedback.trigger(hapticType, HapticOptions);
    }
  };

  const pressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) <= 8;
      },
      onPanResponderGrant: pressIn,
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) < 5) {
          onPress?.();
          triggerHaptic();
        }
        pressOut();
      },

      onPanResponderTerminate: pressOut,
    }),
  ).current;

  return (
    <XStack
      style={{
        width: props.width as DimensionValue,
      }}
      {...panResponder.panHandlers}>
      <Animated.View
        style={{
          width: '100%',
          transform: [{scale: scaleValue}],
        }}>
        <Card
          style={{
            width: '100%',
          }}
          {...props}>
          {children}
        </Card>
      </Animated.View>
    </XStack>
  );
};

export default PressableCard;
