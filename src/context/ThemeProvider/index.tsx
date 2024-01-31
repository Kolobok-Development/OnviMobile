import React, {createContext, useContext, useState, useEffect} from 'react';
import {darkTheme, defaultTheme} from './../../utils/theme';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({});

interface ThemeProviderProps {
  children: any;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  const findOldTheme = async () => {
    const themeMode = await AsyncStorage.getItem('themeMode');

    if (themeMode !== null) {
      themeMode === 'default' ? setTheme(defaultTheme) : setTheme(darkTheme);
    }

    setIsLoadingTheme(false);
  };

  const updateTheme = (currentThemeMode: string) => {
    const newTheme = currentThemeMode === 'default' ? darkTheme : defaultTheme;
    setTheme(newTheme);
    AsyncStorage.setItem('themeMode', newTheme.themeMode);
  };

  useEffect(() => {
    findOldTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        isLoadingTheme: isLoadingTheme,
        updateTheme: updateTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default {ThemeProvider};
