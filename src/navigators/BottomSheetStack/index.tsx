import React from 'react';
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

import {GeneralDrawerNavigationProp} from 'src/types/DrawerNavigation';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const RootStack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef<any>();

const navigateBottomSheet = (name: string, params: any) => {
  if (navigationRef.isReady()) {
    if (name === 'Main') {
      navigationRef.reset({
        index: 0,
        routes: [{name, params}],
      });
    } else {
      navigationRef.navigate(name, params);
    }
  }
};

interface BottomSheetStackInterface {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  active: boolean;
  drawerNavigation: GeneralDrawerNavigationProp<any>;
  cameraRef: any;
  setCamera: (val?: {longitude: number; latitude: number}) => void;
}

const BottomSheetStack = React.memo(
  ({
    bottomSheetRef,
    active,
    drawerNavigation,
    cameraRef,
    setCamera,
  }: BottomSheetStackInterface) => {
    const {setIsMainScreen} = useStore.getState();

    return (
      <NavigationContainer
        theme={navTheme}
        ref={navigationRef}
        independent={true}
        onStateChange={(navigationState: any) => {
          if (
            navigationState.routes &&
            navigationState.routes.length &&
            navigationState.routes[navigationState?.routes.length - 1].name ===
              'Main'
          ) {
            setIsMainScreen(true);
          } else {
            setIsMainScreen(false);
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
              bottomSheetRef,
              drawerNavigation,
              active,
            }}
          />
          <RootStack.Screen
            name="Search"
            key="SearchScreen"
            component={Search}
            initialParams={{bottomSheetRef, setCamera}}
          />
          <RootStack.Screen
            name="Filters"
            key="FiltersScreen"
            component={Filters}
            initialParams={{bottomSheetRef}}
          />
          <RootStack.Screen
            name="Business"
            key="BusinessScreen"
            component={Business}
            initialParams={{bottomSheetRef}}
          />
          <RootStack.Screen
            name="BusinessInfo"
            key="BusinessInfoScreen"
            component={BusinessInfo}
            initialParams={{bottomSheetRef}}
          />
          <RootStack.Screen
            name="Boxes"
            key="BoxesScreen"
            component={Boxes}
            initialParams={{bottomSheetRef, active}}
          />
          <RootStack.Screen
            name="Launch"
            key="LaunchScreen"
            component={Launch}
            initialParams={{bottomSheetRef, active}}
          />
          <RootStack.Screen
            name="Notifications"
            key="NotificationsScreen"
            component={Notifications}
            initialParams={{bottomSheetRef}}
          />
          <RootStack.Screen
            name="History"
            key="HistoryScreen"
            component={History}
            initialParams={{bottomSheetRef, drawerNavigation}}
          />
          <RootStack.Screen
            name="Payment"
            key="PaymentScreen"
            component={Payment}
            initialParams={{bottomSheetRef}}
          />
          <RootStack.Screen
            name="AddCard"
            key="AddCardScreen"
            component={AddCard}
            initialParams={{bottomSheetRef}}
          />
          <RootStack.Screen
            name="Post"
            key="PostScreen"
            component={Post}
            initialParams={{bottomSheetRef}}
          />
          <RootStack.Screen
            name="Campaign"
            key="CampaignScreen"
            component={Campaign}
            initialParams={{bottomSheetRef}}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  },
);

export {BottomSheetStack, navigateBottomSheet};
