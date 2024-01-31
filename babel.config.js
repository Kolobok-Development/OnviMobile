module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
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
          '@hooks': ['./src/hooks'],
          '@services': ['./src/services'],
          '@context': ['./src/context'],
          '@mutations': ['./src/services/api/mutations'],
          '@queries': ['./src/services/api/queries'],
          '@utils': ['./src/utils'],
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
