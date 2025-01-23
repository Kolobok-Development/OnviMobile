import {Image, StyleSheet, Text, View} from 'react-native';
import {dp} from '@utils/dp.ts';
import React, {useEffect, useState} from 'react';
import {Button, Tile} from '@styled/buttons';
import {Slide} from '@styled/silder';
import useStore from '../../../state/store.ts';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

const InputSums: {label: string; description?: string; active?: boolean}[] = [
  {
    label: '50',
    description: 'рублей',
  },
  {
    label: '100',
    description: 'рублей',
  },
  {
    label: '150',
    description: 'рублей',
  },
  {
    label: '200',
    description: 'рублей',
  },
];

const PostPayment = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const {showBurgerButton, orderDetails, setOrderDetails} = useStore();

  useEffect(() => {
    console.log('CHANGING STATE SCREEN ');
    console.log(showBurgerButton);
  }, []);

  const handleTileClick = (tile: any, index: number) => {
    setActiveIndex(index); // Update the active index
    console.log(tile.label); // Return the label of the clicked tile
  };

  const restart = async () => {
    setOrderDetails({
      ...orderDetails,
      sum: Number(InputSums[activeIndex].label),
    });

    navigateBottomSheet('Payment', {});
  };

  const finish = () => {
    setOrderDetails({
      posId: null,
      sum: null,
      bayNumber: null,
      promoCodeId: null,
      rewardPointsUsed: null,
      type: null,
      name: null,
      prices: undefined,
      order: null,
      orderDate: null,
      carwashIndex: undefined,
      status: undefined,
    });
    navigateBottomSheet('Main', {});
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 3,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <Image
          source={require('../../../assets/images/success_image.png')}
          style={styles.image}
        />
        <Text style={styles.titleText}>Оплата прошла успешно!</Text>
        <Text style={styles.titleText}>Удачной мойки!</Text>
      </View>

      {orderDetails.type === 'SelfService' ? (
        <View style={styles.content}>
          <Text style={styles.contentText}>Хотите продолжить мойку? 🚙</Text>
          <Slide
            items={InputSums}
            initialActiveIndex={0}
            onItemClick={(tile, index) => handleTileClick(tile, index)}
            renderItem={(sum, index, isActive, onClick) => (
              <Tile
                key={`tile-${index}`}
                label={sum.label}
                description={sum.description}
                active={activeIndex === index} // Highlight the active tile
                onClick={onClick}
                width={dp(120)} // Adjust size as needed
                height={dp(90)}
                borderRadius={dp(25)}
                labelFontSize={dp(32)} // Example of custom font size
                descriptionFontSize={dp(18)}
              />
            )}
          />
          <Button
            label={'Запустить повторно'}
            color={'blue'}
            height={dp(40)}
            width={dp(343)}
            outlined={true}
            onClick={restart}
          />
        </View>
      ) : (
        <></>
      )}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button
          label={'Завершить'}
          color={'blue'}
          height={dp(40)}
          width={dp(343)}
          onClick={finish}
        />
        <Text style={styles.text}>Если возникли проблемы, свяжитесь</Text>
        <Text style={styles.text}>с нашей техподдержкой</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    backgroundColor: '#fff',
    borderRadius: dp(22),
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: dp(248),
    height: dp(129),
    marginBottom: dp(16),
    resizeMode: 'contain',
  },
  content: {
    flex: 2,
    flexDirection: 'column',
  },
  titleText: {
    fontSize: dp(21),
    fontWeight: '700',
  },
  contentText: {
    fontSize: dp(21),
    fontWeight: '600',
  },
  text: {
    fontSize: dp(12),
  },
});

export {PostPayment};
