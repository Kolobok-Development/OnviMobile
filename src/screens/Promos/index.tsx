import React, { useEffect } from "react";

import {dp} from '../../utils/dp';

import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {BurgerButton} from '@navigators/BurgerButton';
import {useNavigation} from '@react-navigation/core';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useGetCampaignHistory} from '../../api/hooks/useApiUser';
import EmptyPlaceholder from '@components/EmptyPlaceholder';
import {IGetPromoHistoryResponse} from '../../types/api/user/res/IGetPromoHistoryResponse';
import {PromoCard} from '@components/PromoCard';
import { FormattedDate } from 'react-intl';

const Promos = () => {
  const {isLoading, data, refetch} = useGetCampaignHistory();

  const navigation = useNavigation<any>();


  const handlePromoInput = () => {
    navigation.navigate('Ввод Промокода');
  };

  const PromosPlaceholder = () => {
    return (
      <SkeletonPlaceholder borderRadius={4}>
        <View>
          <SkeletonPlaceholder.Item
            marginTop={dp(30)}
            width={'100%'}
            height={dp(80)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={dp(80)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
          <SkeletonPlaceholder.Item
            width={'100%'}
            height={dp(80)}
            borderRadius={dp(10)}
            alignSelf="center"
            marginBottom={dp(10)}
          />
        </View>
      </SkeletonPlaceholder>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BurgerButton isDrawerStack={true} />
        <Text style={styles.screenTitle}>Промокод и Скидки</Text>
      </View>
      <View style={styles.content}>
        <View style={{flex: 1}}>
          <Text style={styles.sectionTitle}>Ввести промокод</Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(245, 245, 245, 1)',
              marginTop: dp(5),
              height: dp(40),
              borderRadius: dp(25),
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              handlePromoInput();
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: dp(14),
                fontWeight: '600',
                opacity: 0.25,
                paddingLeft: dp(10),
              }}>
              Промокод
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cuponContainer}>
          <Text style={styles.sectionTitle}>История</Text>
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
                data={data}
                renderItem={promo => (
                  <PromoCard
                    title={promo.item.title}
                    headerText={'Акция'}
                    bonus={`${promo.item.point} ₽`}
                    date={new Date(promo.item.expiryPeriodDate)}
                    key={promo.item.promotionId.toString()}
                  />
                )}
                onRefresh={refetch}
                refreshing={isLoading}
                keyExtractor={(promo: IGetPromoHistoryResponse) =>
                  promo.promotionId.toString()
                }
                ListEmptyComponent={() => (
                  <View>
                    <EmptyPlaceholder text="У вас нет использованных акций" />
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    marginTop: dp(20),
  },
  screenTitle: {
    fontWeight: '600',
    fontSize: dp(24),
    marginLeft: dp(15),
    textAlignVertical: 'center',
    color: '#000',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginTop: dp(30),
  },
  sectionTitle: {
    fontSize: dp(22),
    color: '#000',
    fontWeight: '600',
  },
  cuponContainer: {
    flex: 3,
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
