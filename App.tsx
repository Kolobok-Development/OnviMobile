import React, {useEffect} from 'react';

import {Dimensions, StyleSheet, View} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {showToast} from '@utils/showToast';
import {ThemeProvider} from '@context/ThemeProvider';
import {AuthProvider} from '@context/AuthContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Application} from '@components/Application';
import ThemeWrapper from '@components/ThemeWrapper';
import { SafeAreaView } from "react-native-safe-area-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App(): React.JSX.Element {
  useEffect(() => {
    showToast({
      type: 'success',
      position: 'top',
      text1: 'Привет!',
      text2: 'Как дела?',
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeWrapper>
          <AuthProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <SafeAreaView style={styles.container}>
                <View style={{height: Dimensions.get('window').height}}>
                  <Application />
                </View>
              </SafeAreaView>
            </GestureHandlerRootView>
          </AuthProvider>
        </ThemeWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
