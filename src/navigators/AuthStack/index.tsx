import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {SignIn} from '@screens/SignIn';
import {Verification} from '@screens/Verification';

const RootStack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SignIn">
        <RootStack.Screen name="SignIn" component={SignIn} />
        <RootStack.Screen name="Verify" component={Verification} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export {AuthStack};
