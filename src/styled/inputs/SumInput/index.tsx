import React from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
  Animated as RNAnimated,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface ISumInput {
  width?: number;
  height?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  borderRadius?: number;
  value?: number;
  onChange?: (value: number) => void;
  onComplete?: (value: number) => void;
  inputBackgroundColor?: string;
  shadowProps: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
  };
}

const SumInput: React.FC<ISumInput> = ({
  width = 200,
  height = 200,
  minValue = 50,
  maxValue = 1000,
  step = 10,
  borderRadius = 1000,
  value: currentValue = 0,
  onChange = () => {},
  onComplete = () => {},
  inputBackgroundColor = '#FFFFFF',
  shadowProps,
}) => {
  const calculateBaseStyles = () => ({
    width,
    height,
    borderRadius,
  });
  const circleBaseStyles = React.useMemo(calculateBaseStyles, [
    width,
    height,
    borderRadius,
  ]);

  const {shadowColor, shadowOffset, shadowOpacity, shadowRadius} = shadowProps;

  const calculateShadowStyles = () => ({
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  });

  const shadowStyles = React.useMemo(calculateShadowStyles, [
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
  ]);

  /**
   * _clamp is a helper function that ensures that the value of the slider is within the range of min and max
   * @param newValue
   * @param minValue
   * @param maxValue
   */
  const _clamp = (newValue: number, min: number, max: number) => {
    return Math.min(Math.max(newValue, min), max);
  };

  /**
   * function that updates the state of the slider with the new value calculated by
   * @param newValue
   */
  const updateNewValue = (newValue: number) => {
    let valueToUpdate = _clamp(newValue, minValue, maxValue);
    _value.value = valueToUpdate;
    value.setValue(valueToUpdate);
  };

  const _moveStartValue = useSharedValue<number>(0); //tracking of initial value on slider move
  const _value = useSharedValue<number>(currentValue); // current value of slider
  const value = new RNAnimated.Value(currentValue); // current value of the slider for animation

  const calculateValues = () => {
    updateNewValue(currentValue);
  };
  React.useEffect(calculateValues, [currentValue]);

  /**
   * is a function that calculates the new value of the slider when it is being dragged based on the current position of the slider, the height of the slider
   * @param gestureState
   */
  const _calculateValue = (gestureState: PanResponderGestureState) => {
    const ratio = -gestureState.dy / (height - 100);
    const diff = maxValue - minValue;
    if (step) {
      const newValue = Math.max(
        minValue,
        Math.min(
          maxValue,
          _moveStartValue.value + Math.round((ratio * diff) / step) * 10,
        ),
      );
      return newValue;
    } else {
      return (
        Math.floor(
          Math.max(minValue, _moveStartValue.value + ratio * diff) * 100,
        ) / 100
      );
    }
  };

  // PanResponder handlers
  const onStartShouldSetPanResponder = () => true;
  const onMoveShouldSetPanResponder = () => false;
  const onPanResponderTerminationRequest = () => false;
  const onPanResponderGrant = () => {
    _moveStartValue.value = _value.value;
  };
  const onPanResponderMove = (
    _event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    onChange(_calculateValue(gestureState));
  };
  const onPanResponderRelease = (
    _event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    onChange(_calculateValue(gestureState));
  };
  const onPanResponderTerminate = (
    _event: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    onComplete(_calculateValue(gestureState));
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder,
      onMoveShouldSetPanResponder,
      onPanResponderTerminationRequest,
      onPanResponderGrant,
      onPanResponderMove,
      onPanResponderRelease,
      onPanResponderTerminate,
    }),
  ).current;

  const sliderStyle = useAnimatedStyle(() => {
    const _newHeight =
      ((_value.value - minValue + 50) * height - 50) / (maxValue - minValue);
    const animatedHeight = withSpring(_newHeight, {
      damping: 20, // Adjust damping for smoothness (higher values make it smoother)
      stiffness: 90, // Adjust stiffness (higher values make it less elastic)
      overshootClamping: true, // Prevent overshooting
      restSpeedThreshold: 0.1, // Lower value for faster response
      restDisplacementThreshold: 0.1, // Lower value for faster response
    });

    return {
      height: animatedHeight,
      aspectRatio: 1,
    };
  });

  return (
    <View style={[circleBaseStyles, shadowStyles]}>
      <View
        style={[
          styles.container,
          circleBaseStyles,
          {backgroundColor: inputBackgroundColor},
        ]}
        {...panResponder.panHandlers}>
        <Animated.View
          style={[
            {
              width: width,
              height: height,
            },
            styles.circle,
            sliderStyle,
          ]}>
          <LinearGradient
            colors={['#0B68E1', '#FFFFFF']}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 1}}
            style={[{width: '100%', height: '100%', opacity: 0.9}]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 0,
  },
  anim: {},
});
export {SumInput};

/*
****Lottie animation option*******
<Lottie source={require('../../../assets/lottie/RbBhBl8Jeb.json')}
                                style={[
                                    circleBaseStyles,

                                ]}
                                autoPlay
                                loop
                    />
 */
/*
    ***Initial animation style to calculate the price******
       const sliderStyle = useAnimatedStyle(
     () => ({

         height: ((_value.value - minValue) * height) / (maxValue - minValue),
     }),
     [_value]
  */
