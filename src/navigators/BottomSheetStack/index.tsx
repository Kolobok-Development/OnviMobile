import React, { useEffect } from 'react';

import {
    DefaultTheme,
  } from '@react-navigation/native';

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Launch, Main, Notifications, History} from '@components/BottomSheetViews';
import { Search } from '@components/BottomSheetViews/Search';
import { Filters } from '@components/BottomSheetViews/Filters';
import { Business } from '@components/BottomSheetViews';
import { BusinessInfo } from '@components/BottomSheetViews/BusinessInfo';
import { Boxes } from '@components/BottomSheetViews/Boxes';
import { Payment } from '@components/BottomSheetViews';
import { AddCard } from '@components/BottomSheetViews/AddCard';
import { Settings } from "@components/BottomSheetViews/Settings"
import { Post } from "@components/BottomSheetViews/Post"

const RootStack = createNativeStackNavigator();

// Navigation Ref
import { createNavigationContainerRef } from '@react-navigation/native';

import { useAppState } from '@context/AppContext';
import { Campaign } from "@components/BottomSheetViews/Campaign";

export const navigationRef = createNavigationContainerRef<any>()

const navigateBottomSheet = (name: string, params: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

const BottomSheetStack = ({ bottomSheetRef, active, drawerNavigation, cameraRef } : any) => {
  const { state, setState } = useAppState()

 useEffect(() => {
    setState({
     ...state,
     bottomSheetOpened: active
    })
   }, [active])

    return (
      <>
        <NavigationContainer theme={navTheme} ref={navigationRef} independent={true} onStateChange={(navigationState) => {
           if (navigationState.routes && navigationState.routes.length && navigationState.routes[navigationState?.routes.length - 1].name === "Main") {
             setState({
               ...state,
               isMainScreen: true
             })
           } else {
             setState({
               ...state,
               isMainScreen: false
           })
          }
        }}>
            <RootStack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName='Main'
            >
                <RootStack.Screen name="Main" component={Main} initialParams={{ bottomSheetRef: bottomSheetRef, drawerNavigation: drawerNavigation, active: active }} />
                <RootStack.Screen name="Search" component={Search} initialParams={{ bottomSheetRef: bottomSheetRef, cameraRef: cameraRef }} />
                <RootStack.Screen name="Filters" component={Filters} initialParams={{ bottomSheetRef: bottomSheetRef }} />
                <RootStack.Screen name="Business" component={Business} initialParams={{ bottomSheetRef: bottomSheetRef }}  />
                <RootStack.Screen name="BusinessInfo" component={BusinessInfo} initialParams={{ bottomSheetRef: bottomSheetRef }}  />
                <RootStack.Screen name="Boxes" component={Boxes} initialParams={{ bottomSheetRef: bottomSheetRef, active: active }}  />
                <RootStack.Screen name="Launch" component={Launch} initialParams={{ bottomSheetRef: bottomSheetRef, active: active }}  />
                <RootStack.Screen name="Notifications" component={Notifications} initialParams={{ bottomSheetRef: bottomSheetRef }}  />
                <RootStack.Screen name="History" component={History} initialParams={{ bottomSheetRef: bottomSheetRef, drawerNavigation: drawerNavigation }}  />
                <RootStack.Screen name="Payment" component={Payment} initialParams={{ bottomSheetRef: bottomSheetRef }} />
                <RootStack.Screen name="AddCard" component={AddCard} initialParams={{ bottomSheetRef: bottomSheetRef }}  />
                <RootStack.Screen name="Settings" component={Settings} initialParams={{ bottomSheetRef: bottomSheetRef }}  />
                <RootStack.Screen name="Post" component={Post} initialParams={{ bottomSheetRef: bottomSheetRef }} />
                <RootStack.Screen name="Campaign" component={Campaign} initialParams={{ bottomSheetRef: bottomSheetRef }} />
            </RootStack.Navigator>
        </NavigationContainer>
      </>
    )
}

export { BottomSheetStack, navigateBottomSheet };
