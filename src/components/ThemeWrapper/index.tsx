import {useTheme} from '@context/ThemeProvider';

const ThemeWrapper = ({children}: any) => {
  const {isThemeLoading} = useTheme() as any;

  if (isThemeLoading) {
    return null;
  } else {
    return children;
  }
};

export default ThemeWrapper;
