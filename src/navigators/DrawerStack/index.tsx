import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

import {Home} from '@screens/Home';
import {Promos} from '@screens/Promos';

import {StyleSheet} from 'react-native';
import {useTheme} from '@context/ThemeProvider';
import {Settings} from '@screens/Settings';
import {About} from '@screens/About';
import {useAuth} from '@context/AuthContext';
import {Partners} from '@screens/Partners';
import {Partner} from '@screens/Partner';

import {PromosInput} from '@screens/PromosInput';

//CustomDrawerContent
import {CustomDrawerContent} from './CustomDrawerContent';

const DrawerStack = () => {
  const {theme}: any = useTheme();
  const {user}: any = useAuth();

  return (
    <NavigationContainer independent={false}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: {
            backgroundColor: theme.mainColor,
            ...styles.drawer,
          },
        }}
        initialRouteName={'Главная'}
        drawerContent={props => {
          return (
            <>
              {user && (
                <CustomDrawerContent
                  navigation={props.navigation}
                  theme={theme}
                  user={user}
                />
              )}
            </>
          );
        }}>
        <Drawer.Screen name="Главная">
          {props => <Home navigation={props.navigation} />}
        </Drawer.Screen>

        <Drawer.Screen name="Промокоды">{() => <Promos />}</Drawer.Screen>
        <Drawer.Screen name="Партнеры">{() => <Partners />}</Drawer.Screen>
        <Drawer.Screen name="Настройки">{() => <Settings />}</Drawer.Screen>
        <Drawer.Screen name="О приложении">{() => <About />}</Drawer.Screen>
        <Drawer.Screen name="Партнер">{() => <Partner />}</Drawer.Screen>
        <Drawer.Screen name="Ввод Промокода">
          {() => <PromosInput />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawer: {
    width: '65%',
  },
  drawerContent: {
    flex: 1,
  },
});

export {DrawerStack};
