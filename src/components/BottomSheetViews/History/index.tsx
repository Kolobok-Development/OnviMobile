import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {dp} from '../../../utils/dp';

import {WHITE} from '../../../utils/colors';

import {BalanceCard} from '@styled/cards/BalanceCard';
import useStore from '../../../state/store';

import {useRoute} from '@react-navigation/native';
import {Settings} from 'react-native-feather';

import {avatarSwitch} from '@screens/Settings';
import EmptyPlaceholder from '@components/EmptyPlaceholder';
import {useGetOrderHistory} from '../../../api/hooks/useApiUser.ts';

import {navigateBottomSheet} from '@navigators/BottomSheetStack';

import HistoryPlaceholder from './HistoryPlaceholder.tsx';

const History = ({drawerNavigation}: any) => {
  const [tab, setTab] = useState(true);

  const {user} = useStore();

  const {data, isLoading, mutate} = useGetOrderHistory({size: 20, page: 1});

  const route: any = useRoute();

  const initialAvatar = user?.avatar || 'both.jpg';

  const avatarValue = avatarSwitch(initialAvatar);

  useEffect(() => {
    console.log(`ORDER => ${JSON.stringify(data)}`);
  }, []);

  useEffect(() => {
    if (
      route &&
      route.params &&
      route.params.type &&
      route.params.type === 'history'
    ) {
      setTab(false);
    }
  }, [route.params.type]);

  return (
    <View style={styles.container}>
      <View
        style={{
          paddingBottom: dp(30),
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <Image
            source={avatarValue}
            style={{
              width: dp(60),
              height: dp(60),
            }}
          />
          {user && user.name && (
            <Text
              style={{
                fontWeight: '600',
                fontSize: dp(24),
                paddingLeft: dp(5),
                flexShrink: 1,
              }}
              numberOfLines={3}
              ellipsizeMode="tail">
              {user.name}
            </Text>
          )}
        </View>
        <View
          style={{
            width: dp(34),
            height: dp(34),
            borderRadius: dp(50),
            backgroundColor: '#000000',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigateBottomSheet('Main', {});
              route.params.drawerNavigation.navigate('Настройки');
            }}>
            <Settings stroke={'white'} width={dp(18)} height={dp(18)} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actions}>
        <Text
          style={{
            fontSize: dp(19),
            fontWeight: '600',
            letterSpacing: 0.5,
          }}>
          История заказов
        </Text>
        {/*<Button
          label="История"
          onClick={() => switchTab(false)}
          color={!tab ? 'blue' : 'lightGrey'}
          width={149}
          height={43}
          fontSize={18}
          fontWeight="600"
        />*/}
        {/*<View style={{width: dp(3)}} />
        <View style={styles.notifications}>
          <Button
            label="Уведомления"
            onClick={() => switchTab(true)}
            color={tab ? 'blue' : 'lightGrey'}
            width={189}
            height={43}
            fontSize={18}
            fontWeight="600"
          />
          <NotificationCircle number={4} />
        </View>*/}
      </View>
      {isLoading ? (
        <HistoryPlaceholder />
      ) : (
        <>
          <FlatList
            data={data}
            renderItem={order => (
              <BalanceCard key={order.index} option={order.item} />
            )}
            refreshing={isLoading}
            keyExtractor={(_order, index) => index.toString()}
            onRefresh={mutate}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <>
                <EmptyPlaceholder text="У вас пока нет заказов" />
              </>
            )}
          />
        </>
      )}
    </View>
  );
};

/*
<ScrollView
              contentContainerStyle={{paddingBottom: dp(200)}}
              showsVerticalScrollIndicator={false}>
              {orders.length ? (
                orders.map((order, index) => (
                  <BalanceCard key={index} option={order} />
                ))
              ) : (
                <EmptyPlaceholder text="История операций пока пуста" />
              )}
            </ScrollView>
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('screen').height,
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: dp(16),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
  box: {
    marginVertical: 10,
    width: dp(342),
    height: dp(78),
    backgroundColor: '#F5F5F5',
    borderRadius: dp(25),
  },
  scrollView: {
    flex: 1,
  },
  notifications: {
    position: 'relative',
    flexDirection: 'row',
  },
});

export {History};
