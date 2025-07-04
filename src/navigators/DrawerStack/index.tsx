import React, {Suspense} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {ActivityIndicator, View} from 'react-native';

const Drawer = createDrawerNavigator();

// Lazy load screens
const Home = React.lazy(() => import('@screens/Home').then(module => ({default: module.Home})));
const Promos = React.lazy(() => import('@screens/Promos').then(module => ({default: module.Promos})));
const Settings = React.lazy(() => import('@screens/Settings').then(module => ({default: module.Settings})));
const About = React.lazy(() => import('@screens/About').then(module => ({default: module.About})));
const PromosInput = React.lazy(() => import('@screens/PromosInput').then(module => ({default: module.PromosInput})));
const TransferBalance = React.lazy(() => import('@screens/TransferBalance').then(module => ({default: module.TransferBalance})));
const Legals = React.lazy(() => import('@screens/Legals').then(module => ({default: module.Legals})));

import {useTheme} from '@context/ThemeProvider';
import useStore from '../../state/store';

//CustomDrawerContent
import {CustomDrawerContent} from './CustomDrawerContent';
import {DrawerNavProp} from '../../types/navigation/DrawerNavigation.ts';

// Loading component
const LoadingScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" />
  </View>
);

const DrawerStack = () => {
  const {theme} = useTheme();
  const {user} = useStore.getState();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: theme.mainColor,
        },
        lazy: true,
      }}
      initialRouteName={'Главная'}
      /* eslint-disable-next-line react/no-unstable-nested-components */
      drawerContent={props => {
        return (
          <>
            {user && (
              <CustomDrawerContent
                navigation={props.navigation as unknown as DrawerNavProp}
                theme={theme}
                user={user}
              />
            )}
          </>
        );
      }}>
      <Drawer.Screen name="Главная">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <Home navigation={props.navigation} />
          </Suspense>
        )}
      </Drawer.Screen>

      <Drawer.Screen name="Промокоды">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <Promos />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Настройки">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <Settings />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="О приложении">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <About />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Ввод Промокода">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <PromosInput />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Перенести баланс">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <TransferBalance />
          </Suspense>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="Правовые документы">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <Legals />
          </Suspense>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export {DrawerStack};
