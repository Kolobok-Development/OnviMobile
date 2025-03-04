import React /*, {useState} */ from 'react';

import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';

import {DrawerContentScrollView} from '@react-navigation/drawer';

import {dp} from '../../../utils/dp';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {avatarSwitch} from '@screens/Settings';
import {formatPhoneNumber} from '../../../utils/phoneFormat';

import {DrawerNavProp} from '../../../types/navigation/DrawerNavigation.ts';

interface CustomDrawerItemProps {
  label: string;
  color: string;
  onPress: any;
}

interface CustomDrawerContentProps {
  navigation: DrawerNavProp;
  theme: any;
  user: any;
}

const CustomDrawerItem = ({label, color, onPress}: CustomDrawerItemProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        paddingBottom: dp(15),
      }}
      onPress={onPress}>
      <Text
        style={{
          color: color,
          fontWeight: '500',
          fontSize: dp(20),
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawerContent = ({
  navigation,
  theme,
  user,
}: CustomDrawerContentProps) => {
  const initialAvatar = user.avatar;

  const avatarValue = avatarSwitch(initialAvatar);
  const route = navigation.getState().routes[navigation.getState().index].name;

  return (
    <>
      <View style={{flex: 1}}>
        <DrawerContentScrollView scrollEnabled={false}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              paddingTop: dp(20),
              paddingLeft: dp(20),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingBottom: dp(15),
                borderRadius: dp(10),
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Настройки')}>
              {/*Profile*/}
              <View
                style={{
                  shadowColor: '#494949',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.11,
                  shadowRadius: 2.11,
                  elevation: 5,
                }}>
                <Image
                  source={avatarValue}
                  style={{
                    width: dp(58),
                    marginTop: dp(32),
                    height: dp(58),
                    borderRadius: dp(68),
                  }}
                />
              </View>
            </TouchableOpacity>
            {/*items*/}
            <View>
              {!user || !user.name ? (
                <View style={{paddingTop: dp(20)}}>
                  <SkeletonPlaceholder borderRadius={4}>
                    <Text
                      style={{
                        paddingTop: dp(24),
                        fontStyle: 'normal',
                        fontSize: dp(24),
                        fontWeight: '600',
                        lineHeight: dp(23),
                        color: theme.textColor,
                      }}
                    />
                  </SkeletonPlaceholder>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    paddingBottom: dp(10),
                  }}
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Настройки'}],
                    })
                  }>
                  <Text
                    style={{
                      fontStyle: 'normal',
                      fontSize: dp(20),
                      fontWeight: '600',
                      lineHeight: dp(23),
                      letterSpacing: 0.43,
                      color: theme.textColor,
                    }}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              )}
              {!user || !user.phone ? (
                <View style={{paddingTop: dp(18)}}>
                  <SkeletonPlaceholder borderRadius={4}>
                    <Text
                      style={{
                        marginBottom: dp(45),
                        fontStyle: 'normal',
                        fontSize: dp(10),
                        fontWeight: '800',
                        lineHeight: dp(20),
                        letterSpacing: 0.43,
                        color: '#BEBEBE',
                        width: '70%',
                      }}
                    />
                  </SkeletonPlaceholder>
                </View>
              ) : (
                <Text
                  style={{
                    marginBottom: dp(45),
                    fontStyle: 'normal',
                    fontSize: dp(10),
                    fontWeight: '800',
                    lineHeight: dp(20),
                    color: '#BEBEBE',
                    letterSpacing: 0.23,
                  }}>
                  {formatPhoneNumber(user.phone)}
                </Text>
              )}

              <CustomDrawerItem
                label={'Главная'}
                color={route === 'Главная' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Главная'}],
                  });
                }}
              />
              <CustomDrawerItem
                label={'Партнеры'}
                color={route === 'Партнеры' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Партнеры'}],
                  });
                }}
              />
              <CustomDrawerItem
                label={'Акции'}
                color={route === 'Промокоды' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Промокоды'}],
                  });
                }}
              />
              <CustomDrawerItem
                label={'Настройки'}
                color={route === 'Настройки' ? theme.primary : theme.textColor}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Настройки'}],
                  });
                }}
              />
            </View>
          </View>
        </DrawerContentScrollView>
        <View
          style={{
            padding: dp(20),
            display: 'flex',
            flexDirection: 'column',
            marginBottom: dp(80),
          }}>
          <TouchableOpacity
            style={{
              borderColor: '#3461FF',
              borderWidth: 2,
              borderRadius: 25,
              padding: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingEnd: dp(20),
              paddingStart: dp(20),
            }}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Перенести баланс'}],
              });
            }}>
            <Text
              style={{
                fontSize: dp(18),
                fontWeight: '600',
              }}>
              Перенос Баланса
            </Text>
            <Image
              style={{
                width: dp(25),
                height: dp(25),
                marginLeft: dp(5),
              }}
              source={require('../../../assets/icons/transfer-balance-icon.png')}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: dp(20),
            }}>
            <Image
              style={{
                marginRight: dp(5),
                width: dp(25),
                height: dp(25),
              }}
              source={require('../../../assets/icons/telegram.png')}
            />

            <TouchableOpacity
              onPress={() => Linking.openURL('https://t.me/OnviSupportBot')}>
              <Text
                style={{
                  fontSize: dp(10),
                  color: '#717586',
                  fontWeight: '600',
                }}>
                Служба поддержки
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export {CustomDrawerContent};
