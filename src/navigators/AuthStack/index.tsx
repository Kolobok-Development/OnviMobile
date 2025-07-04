import React, {Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ActivityIndicator, View} from 'react-native';

const SignIn = React.lazy(() =>
  import('@screens/SignIn').then(module => ({default: module.SignIn})),
);
const Verification = React.lazy(() =>
  import('@screens/Verification').then(module => ({
    default: module.Verification,
  })),
);

const LoadingScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" />
  </View>
);

const RootStack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SignIn">
      <RootStack.Screen name="SignIn">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <SignIn />
          </Suspense>
        )}
      </RootStack.Screen>
      <RootStack.Screen name="Verify">
        {props => (
          <Suspense fallback={<LoadingScreen />}>
            <Verification {...props} />
          </Suspense>
        )}
      </RootStack.Screen>
    </RootStack.Navigator>
  );
};

export {AuthStack};
