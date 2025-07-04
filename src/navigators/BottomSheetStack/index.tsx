import React, {useEffect, Suspense} from 'react';
import {DefaultTheme} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActivityIndicator, View} from 'react-native';
import useStore from '../../state/store';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {createNavigationContainerRef} from '@react-navigation/native';

// Lazy load components
const Launch = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.Launch,
  })),
);
const Main = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.Main,
  })),
);
const Notifications = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.Notifications,
  })),
);
const History = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.History,
  })),
);
const PostPayment = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.PostPayment,
  })),
);
const PaymentLoading = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.PaymentLoading,
  })),
);
const Search = React.lazy(() =>
  import('@components/BottomSheetViews/Search').then(module => ({
    default: module.Search,
  })),
);
const Filters = React.lazy(() =>
  import('@components/BottomSheetViews/Filters').then(module => ({
    default: module.Filters,
  })),
);
const Business = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.Business,
  })),
);
const BusinessInfo = React.lazy(() =>
  import('@components/BottomSheetViews/BusinessInfo').then(module => ({
    default: module.BusinessInfo,
  })),
);
const Boxes = React.lazy(() =>
  import('@components/BottomSheetViews/Boxes').then(module => ({
    default: module.Boxes,
  })),
);
const Payment = React.lazy(() =>
  import('@components/BottomSheetViews').then(module => ({
    default: module.Payment,
  })),
);
const AddCard = React.lazy(() =>
  import('@components/BottomSheetViews/AddCard').then(module => ({
    default: module.AddCard,
  })),
);
const Post = React.lazy(() =>
  import('@components/BottomSheetViews/Post').then(module => ({
    default: module.Post,
  })),
);
const Campaign = React.lazy(() =>
  import('@components/BottomSheetViews/Campaign').then(module => ({
    default: module.Campaign,
  })),
);

import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';

// Loading component
const LoadingScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" />
  </View>
);

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
          } else if (
            currentRoute?.name === 'PostPayment' ||
            currentRoute?.name === 'PaymentLoading'
          ) {
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
            initialParams={{
              drawerNavigation,
              active,
            }}>
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Main {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="Search"
            key="SearchScreen"
            initialParams={{setCamera}}>
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Search {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Filters" key="FiltersScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Filters {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Business" key="BusinessScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Business {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="BusinessInfo" key="BusinessInfoScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <BusinessInfo {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="Boxes"
            key="BoxesScreen"
            initialParams={{active}}>
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Boxes {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="Launch"
            key="LaunchScreen"
            initialParams={{active}}>
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Launch {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Notifications" key="NotificationsScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Notifications {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="History"
            key="HistoryScreen"
            initialParams={{drawerNavigation}}>
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <History {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Payment" key="PaymentScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Payment {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="AddCard" key="AddCardScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <AddCard {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Post" key="PostScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Post {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Campaign" key="CampaignScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <Campaign {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="PostPayment" key="PostPaymentScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <PostPayment {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
          <RootStack.Screen name="PaymentLoading" key="PaymentLoadingScreen">
            {props => (
              <Suspense fallback={<LoadingScreen />}>
                <PaymentLoading {...props} />
              </Suspense>
            )}
          </RootStack.Screen>
        </RootStack.Navigator>
      </NavigationContainer>
    );
  },
);

export {BottomSheetStack, navigateBottomSheet};
