import React from 'react';
import {TamaguiProvider, View, Text} from 'tamagui';

import config from '../../../tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={config}>
      <View padding="$4" backgroundColor="$background">
        <Text color="$color">Hello from Tamagui!</Text>
      </View>
    </TamaguiProvider>
  );
}
