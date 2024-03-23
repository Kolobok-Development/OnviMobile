import {dp} from '../../../utils/dp';
import React, {useEffect, useState} from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {WHITE} from '../../../utils/colors';

interface IButton {
  label: string;
  onClick?: any;
  disabled?: boolean;
  showLoading?: boolean;
  color: 'blue' | 'grey' | 'lightGrey';
  width?: number;
  height?: number;
  fontSize?: number;
  fontWeight?: '600';
}

const Button: React.FC<IButton> = ({
  label = '',
  onClick = () => null,
  disabled = false,
  color = 'blue',
  width,
  height,
  fontSize,
  fontWeight,
  showLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={{
        ...styles.button,
        ...styles[color],
        width: width ? dp(width) : dp(285),
        height: height ? dp(height) : dp(48),
      }}>
      {showLoading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <Text
          style={{
            ...styles.buttonText,
            fontSize: fontSize ? dp(fontSize) : dp(18),
            fontWeight: fontWeight ? fontWeight : '500',
          }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // width: 285,
    // height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grey: {
    backgroundColor: '#A3A3A6',
    borderRadius: 24,
  },
  blue: {
    backgroundColor: '#0B68E1',
  },
  buttonText: {
    color: WHITE,
  },
  lightGrey: {
    backgroundColor: 'rgba(216, 217, 221, 1)',
  },
});

export {Button};
