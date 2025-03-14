import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {SignIn} from '@screens/SignIn';
import {Verification} from '@screens/Verification';

const RootStack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SignIn">
      <RootStack.Screen name="SignIn" component={SignIn} />
      <RootStack.Screen name="Verify" component={Verification} />
    </RootStack.Navigator>
  );
};

export {AuthStack};
