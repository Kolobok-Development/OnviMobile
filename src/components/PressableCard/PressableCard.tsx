import React, {useRef} from 'react';
import {Pressable, Animated, DimensionValue} from 'react-native';
import {Card, CardProps} from 'tamagui';

interface PressableCardProps extends CardProps {
  onPress?: () => void;
  children: React.ReactNode;
}

const PressableCard = ({onPress, children, ...props}: PressableCardProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

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

  const handlePress = () => {
    onPress && onPress();
  };

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={handlePress}
      delayLongPress={500}
      style={{
        width: props.width as DimensionValue,
      }}>
      <Animated.View
        style={{
          transform: [{scale: scaleValue}],
          width: '100%',
        }}>
        <Card
          {...props}
          style={{
            width: '100%',
          }}>
          {children}
        </Card>
      </Animated.View>
    </Pressable>
  );
};

export default PressableCard;
