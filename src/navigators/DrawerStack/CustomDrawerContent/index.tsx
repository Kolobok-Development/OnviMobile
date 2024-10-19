import React from 'react';

import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';

import {DrawerContentScrollView} from '@react-navigation/drawer';

import {dp} from '../../../utils/dp';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {avatarSwitch} from '@screens/Settings';
import {formatPhoneNumber} from '../../../utils/phoneFormat';

interface CustomDrawerItemProps {
  label: string;
  color: string;
  onPress: any;
}

interface CustomDrawerContentProps {
  navigation: any;
  theme: any;
  user: any;
}

const CustomDrawerItem = ({label, color, onPress}: CustomDrawerItemProps) => {
  return (
    <TouchableOpacity
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flexDirection: 'row',
        paddingBottom: dp(15),
      }}
      onPress={onPress}>
      <Text
        // eslint-disable-next-line react-native/no-inline-styles
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
    <View style={{flex: 1}}>
      <DrawerContentScrollView scrollEnabled={false}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flex: 1,
            alignItems: 'flex-start',
            paddingTop: dp(20),
            paddingLeft: dp(20),
          }}>
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
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
                    // eslint-disable-next-line react-native/no-inline-styles
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
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  flexDirection: 'row',
                  paddingBottom: dp(10),
                }}
                onPress={() => navigation.navigate('Настройки')}>
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
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
                    // eslint-disable-next-line react-native/no-inline-styles
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
                // eslint-disable-next-line react-native/no-inline-styles
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
                navigation.navigate('Главная');
              }}
            />
            <CustomDrawerItem
              label={'Партнеры'}
              color={route === 'Партнеры' ? theme.primary : theme.textColor}
              onPress={() => {
                navigation.navigate('Партнеры');
              }}
            />
            <CustomDrawerItem
              label={'Акции'}
              color={route === 'Промокоды' ? theme.primary : theme.textColor}
              onPress={() => {
                navigation.navigate('Промокоды');
              }}
            />
            <CustomDrawerItem
              label={'Настройки'}
              color={route === 'Настройки' ? theme.primary : theme.textColor}
              onPress={() => {
                navigation.navigate('Настройки');
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          padding: dp(20),
          display: 'flex',
          flexDirection: 'column',
          marginBottom: dp(80),
        }}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
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
              // eslint-disable-next-line react-native/no-inline-styles
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
  );
};

export {CustomDrawerContent};
