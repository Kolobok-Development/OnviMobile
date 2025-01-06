import React from 'react';

import {dp} from '../../utils/dp';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import {BurgerButton} from '@navigators/BurgerButton';
import {useNavigation} from '@react-navigation/core';
import EmptyPlaceholder from '@components/EmptyPlaceholder';
import {IGetPromoHistoryResponse} from '../../types/api/user/res/IGetPromoHistoryResponse';
import {PromoCard} from '@components/PromoCard';

import PromosPlaceholder from './PromosPlaceholder';

import {GeneralDrawerNavigationProp} from 'src/types/DrawerNavigation';
import {PersonalPromoBanner} from '@styled/banners/PersonalPromoBanner';

const Promos = () => {
  const navigation = useNavigation<GeneralDrawerNavigationProp<'Промокоды'>>();

  const isLoading = false;

  const handlePromoInput = () => {
    navigation.navigate('Ввод Промокода');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BurgerButton isDrawerStack={true} />
          <Text style={styles.screenTitle}>Акции</Text>
          <View style={{width: dp(50)}} />
        </View>
        <View style={styles.content}>
          <View style={{}}>
            <Text style={styles.sectionTitle}>Персональные акции</Text>
            <PersonalPromoBanner
              title={'Вторая мойка в подарок'}
              date={'до 28 мая'}
              onPress={() => console.log('ok')}
            />
          </View>
          <View style={styles.cuponContainer}>
            <Text style={styles.sectionTitle}>Общие промокоды</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: dp(25),
              }}>
              {isLoading ? (
                <PromosPlaceholder />
              ) : (
                <FlatList
                  data={[]}
                  renderItem={promo => (
                    <PromoCard
                      title={promo.item.title}
                      headerText={'Акция'}
                      bonus={
                        promo.item.point > 0
                          ? promo.item.point + ' ₽'
                          : promo.item.cashbackSum + ' %'
                      }
                      date={new Date(promo.item.expiryPeriodDate)}
                      key={promo.item.promotionId.toString()}
                    />
                  )}
                  // onRefresh={mutate}
                  // refreshing={isLoading}
                  keyExtractor={(promo: IGetPromoHistoryResponse) =>
                    promo.promotionId.toString()
                  }
                  ListEmptyComponent={() => (
                    <EmptyPlaceholder text="У вас нет активных бонусов" />
                  )}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    letterSpacing: 0.2,
    color: '#000',
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginTop: dp(30),
  },
  sectionTitle: {
    fontSize: dp(20),
    color: '#000',
    fontWeight: '600',
    marginBottom: dp(8),
  },
  cuponContainer: {
    flex: 3,
    marginTop: dp(16),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: dp(20),
    borderRadius: 38,
    width: dp(341),
    height: dp(309),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: dp(24),
    paddingBottom: dp(3),
  },
  modalText: {
    fontWeight: '400',
    fontSize: dp(16),
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: dp(27),
  },
  circleImage: {
    width: dp(45),
    height: dp(45),
  },
  copyImage: {
    width: dp(24),
    height: dp(24),
  },
});

export {Promos};
