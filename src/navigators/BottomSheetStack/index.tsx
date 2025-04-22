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
import {err} from 'react-native-svg';
import {useLogger} from '@react-navigation/devtools';

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

const navigateBottomSheet = (name, params) => {
  const currentRoute = navigationRef.current?.getCurrentRoute();
  if (currentRoute?.name !== name) {
    navigationRef.current?.navigate(name, params);
  } else {
    console.log(`Already on ${name} screen, skipping navigation`);
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

    useLogger(navigationRef);

    return (
      <NavigationContainer
        theme={navTheme}
        ref={navigationRef}
        independent={true}
        onReady={() => {
          console.log('[NAV] Navigation container is ready');
        }}
        onStateChange={(navigationState: any) => {
          console.log(
            '[NAV] State changed:',
            navigationState
              ? `Current route: ${
                  navigationState.routes?.[navigationState.routes.length - 1]
                    ?.name
                }, 
      Route count: ${navigationState.routes?.length}`
              : 'Navigation state is null',
          );

          if (!navigationState) {
            console.warn('[NAV] Navigation state is null, returning early');
            return;
          }

          const currentRoute =
            navigationState.routes?.[navigationState.routes.length - 1];

          if (!currentRoute) {
            console.warn('[NAV] Current route is undefined, returning early');
            return;
          }

          console.log('[NAV] Current route name:', currentRoute.name);
          console.log('[NAV] Current route params:', currentRoute.params);
          console.log(
            '[NAV] Setting current route name to:',
            currentRoute.name,
          );

          setCurrentRouteName(currentRoute.name);

          if (
            navigationState.routes &&
            navigationState.routes.length &&
            currentRoute?.name === 'Main'
          ) {
            console.log(
              '[NAV] On Main screen, setting isMainScreen=true, showBurgerButton=true',
            );
            setIsMainScreen(true);
            setShowBurgerButton(true);
          } else if (currentRoute?.name === 'PostPayment') {
            console.log(
              '[NAV] On PostPayment screen, setting showBurgerButton=false',
            );
            setShowBurgerButton(false);
          } else {
            console.log(
              `[NAV] On ${currentRoute.name} screen, setting isMainScreen=false, showBurgerButton=true`,
            );
            setIsMainScreen(false);
            setShowBurgerButton(true);
          }

          console.log(
            '[NAV] Full navigation state:',
            JSON.stringify(navigationState, null, 2),
          );
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
            listeners={{
              focus: () => {
                console.log('[NAV] Main screen focused');
              },
              blur: () => {
                console.log('[NAV] Main screen blurred');
              },
            }}
          />
          <RootStack.Screen
            name="Search"
            key="SearchScreen"
            component={Search}
            initialParams={{setCamera}}
            listeners={{
              focus: () => {
                console.log('[NAV] Search screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Filters"
            key="FiltersScreen"
            component={Filters}
            listeners={{
              focus: () => {
                console.log('[NAV] Filters screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Business"
            key="BusinessScreen"
            component={Business}
            listeners={{
              focus: () => {
                console.log('[NAV] Business screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="BusinessInfo"
            key="BusinessInfoScreen"
            component={BusinessInfo}
            listeners={{
              focus: () => {
                console.log('[NAV] BusinessInfo screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Boxes"
            key="BoxesScreen"
            component={Boxes}
            initialParams={{active}}
            listeners={{
              focus: () => {
                console.log('[NAV] Boxes screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Launch"
            key="LaunchScreen"
            component={Launch}
            initialParams={{active}}
            listeners={{
              focus: () => {
                console.log('[NAV] Launch screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Notifications"
            key="NotificationsScreen"
            component={Notifications}
            listeners={{
              focus: () => {
                console.log('[NAV] Notifications screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="History"
            key="HistoryScreen"
            component={History}
            initialParams={{drawerNavigation}}
            listeners={{
              focus: () => {
                console.log('[NAV] History screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Payment"
            key="PaymentScreen"
            component={Payment}
            listeners={{
              focus: () => {
                console.log('[NAV] Payment screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="AddCard"
            key="AddCardScreen"
            component={AddCard}
            listeners={{
              focus: () => {
                console.log('[NAV] AddCard screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Post"
            key="PostScreen"
            component={Post}
            listeners={{
              focus: () => {
                console.log('[NAV] Post screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="Campaign"
            key="CampaignScreen"
            component={Campaign}
            listeners={{
              focus: () => {
                console.log('[NAV] Campaign screen focused');
              },
            }}
          />
          <RootStack.Screen
            name="PostPayment"
            key="PostPaymentScreen"
            component={PostPayment}
            listeners={{
              focus: () => {
                console.log('[NAV] PostPayment screen focused');
              },
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  },
);

export {BottomSheetStack, navigateBottomSheet};
