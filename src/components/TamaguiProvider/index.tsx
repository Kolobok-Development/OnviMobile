import {ReactNode} from 'react';

import {TamaguiProvider as Provider, createTamagui} from '@tamagui/core';
import {defaultConfig} from '@tamagui/config/v4';

const config = createTamagui(defaultConfig);

type Conf = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

interface TamaguiProviderProps {
  children: ReactNode;
}

export default function TamaguiProvider({children}: TamaguiProviderProps) {
  return <Provider config={config}>{children}</Provider>;
}
