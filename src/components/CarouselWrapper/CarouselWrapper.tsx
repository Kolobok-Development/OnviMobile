import React, {useRef} from 'react';
import {View, PanResponder} from 'react-native';

interface CarouselWrapperProps {
  children: React.ReactNode;
}

const CarouselWrapper = ({children}: CarouselWrapperProps) => {
  const panResponder = useRef(
    PanResponder.create({
      // Разрешаем начать захват жеста
      onStartShouldSetPanResponder: () => true,

      // Решаем, нужно ли захватывать движение
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const {dx, dy} = gestureState;

        // Захватываем только если движение преимущественно горизонтальное
        // и достаточно значительное (чтобы избежать ложных срабатываний)
        const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.5;
        const isSignificant = Math.abs(dx) > 5;

        return isHorizontal && isSignificant;
      },

      // Когда жест захвачен
      onPanResponderGrant: () => {
        // Можно добавить какую-то логику при начале жеста
      },

      // Когда жест отпущен
      onPanResponderRelease: () => {
        // Логика при отпускании
      },

      // Разрешаем другим обработчикам перехватывать жест
      onPanResponderTerminationRequest: () => true,

      // Когда жест прерван другим обработчиком
      onPanResponderTerminate: () => {
        // Очистка или другая логика
      },
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers} style={{flex: 1}}>
      {children}
    </View>
  );
};

export default CarouselWrapper;
