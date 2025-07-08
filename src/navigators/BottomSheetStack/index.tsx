import React, {useEffect} from 'react';
import {DefaultTheme} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useStore from '../../state/store';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {createNavigationContainerRef} from '@react-navigation/native';

import {
  Launch,
  Main,
  Notifications,
  History,
  PostPayment,
  PaymentLoading
} from '@components/BottomSheetViews';
import {Search} from '@components/BottomSheetViews/Search';
import {Filters} from '@components/BottomSheetViews/Filters';
import {Business} from '@components/BottomSheetViews';
import {BusinessInfo} from '@components/BottomSheetViews/BusinessInfo';
import {Boxes} from '@components/BottomSheetViews/Boxes';
import {Payment} from '@components/BottomSheetViews';
import {AddCard} from '@components/BottomSheetViews/AddCard';
import {Post} from '@components/BottomSheetViews/Post';
import {Campaign} from '@components/BottomSheetViews/Campaign';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const RootStack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef<any>();

// const navigateBottomSheet = function (name: string, params: any) {
//   if (navigationRef.isReady()) {
//     if (name === 'Main') {
//       try {
//         navigationRef.reset({
//           index: 0,
//           routes: [{name, params}],
//         });
//       } catch (error) {
//         // Error handling removed
//       }
//     } else {
//       try {
//         navigationRef.navigate(name, params);
//       } catch (error) {
//         console.error('[NAVIGATION] Navigation error:', error);
//         console.debug('[NAVIGATION] Navigation parameters:', {name, params});
//       }
//     }
//   }
// };

const navigateBottomSheet = (name: string, params: any) => {
  const currentRoute = navigationRef.current?.getCurrentRoute();
  if (currentRoute?.name !== name) {
    navigationRef.current?.navigate(name, params);
  }
};

interface BottomSheetStackInterface {
  active: boolean;
  drawerNavigation: GeneralDrawerNavigationProp<any>;
  cameraRef: any;
  setCamera: (val?: {longitude: number; latitude: number}) => void;
}

const BottomSheetStack = React.memo(
  ({
    active,
    drawerNavigation,
    cameraRef,
    setCamera,
  }: BottomSheetStackInterface) => {
    const {setIsMainScreen, setShowBurgerButton, setCurrentRouteName} =
      useStore.getState();

    return (
      <NavigationContainer
        theme={navTheme}
        ref={navigationRef}
        independent={true}
        onStateChange={(navigationState: any) => {
          if (!navigationState) {
            return;
          }

          const currentRoute =
            navigationState.routes?.[navigationState.routes.length - 1];

          if (!currentRoute) {
            return;
          }

          setCurrentRouteName(currentRoute.name);

          if (
            navigationState.routes &&
            navigationState.routes.length &&
            currentRoute?.name === 'Main'
          ) {
            setIsMainScreen(true);
            setShowBurgerButton(true);
          } else if (currentRoute?.name === 'PostPayment' || currentRoute?.name === 'PaymentLoading') {
            setShowBurgerButton(false);
          } else {
            setIsMainScreen(false);
            setShowBurgerButton(true);
          }
        }}>
        <RootStack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Main">
          <RootStack.Screen
            name="Main"
            key="MainScreen"
            component={Main}
            initialParams={{
              drawerNavigation,
              active,
            }}
          />
          <RootStack.Screen
            name="Search"
            key="SearchScreen"
            component={Search}
            initialParams={{setCamera}}
          />
          <RootStack.Screen
            name="Filters"
            key="FiltersScreen"
            component={Filters}
          />
          <RootStack.Screen
            name="Business"
            key="BusinessScreen"
            component={Business}
          />
          <RootStack.Screen
            name="BusinessInfo"
            key="BusinessInfoScreen"
            component={BusinessInfo}
          />
          <RootStack.Screen
            name="Boxes"
            key="BoxesScreen"
            component={Boxes}
            initialParams={{active}}
          />
          <RootStack.Screen
            name="Launch"
            key="LaunchScreen"
            component={Launch}
            initialParams={{active}}
          />
          <RootStack.Screen
            name="Notifications"
            key="NotificationsScreen"
            component={Notifications}
          />
          <RootStack.Screen
            name="History"
            key="HistoryScreen"
            component={History}
            initialParams={{drawerNavigation}}
          />
          <RootStack.Screen
            name="Payment"
            key="PaymentScreen"
            component={Payment}
          />
          <RootStack.Screen
            name="AddCard"
            key="AddCardScreen"
            component={AddCard}
          />
          <RootStack.Screen name="Post" key="PostScreen" component={Post} />
          <RootStack.Screen
            name="Campaign"
            key="CampaignScreen"
            component={Campaign}
          />
          <RootStack.Screen
            name="PostPayment"
            key="PostPaymentScreen"
            component={PostPayment}
          />
          <RootStack.Screen
            name="PaymentLoading"
            key="PaymentLoadingScreen"
            component={PaymentLoading}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  },
);

export {BottomSheetStack, navigateBottomSheet};
