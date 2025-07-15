module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      '@tamagui/babel-plugin',
      {
        components: ['tamagui'],
        config: './tamagui.config.ts',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@styled': './src/styled',
          '@screens': './src/screens',
          '@navigators': './src/navigators',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@context': './src/context',
          '@mutations': './src/services/api/mutations',
          '@queries': './src/services/api/queries',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@app-types': './src/types',
          '@state': './src/state',
          '@shared': './src/shared',
          '@native': './src/native',
        },
      },
    ],
  ],
};
