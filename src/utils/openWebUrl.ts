import {Linking} from 'react-native';
import Toast from 'react-native-toast-message';

export const openWebURL = async (url: string) => {
  try {
    // Check if the link can be opened
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Open the link with the default browser or app
      await Linking.openURL(url);
    } else {
      Toast.show({
        type: 'customErrorToast',
        text1: 'Не получилось открыть файл',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'customErrorToast',
      text1: 'Произошла ошибка попробуйте чуть позже',
    });
  }
};
