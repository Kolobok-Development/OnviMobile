import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';

import {dp} from '../../../utils/dp';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/metrics';

interface IBox {
  label: string;
  labelStyles?: StyleProp<TextStyle>;
  onClick?: any;
  disabled?: boolean;
  active: boolean;
  width?: number;
  height?: number;
  borderRadius?: number;
  isFree?: boolean;
  showBorder?: boolean;
}

const Box: React.FC<IBox> = ({
  label = '',
  onClick = () => null,
  disabled = false,
  active = false,
  isFree = true,
  showBorder = false,
  width = horizontalScale(92),
  height = verticalScale(92),
  borderRadius = moderateScale(21),
  labelStyles = {
    fontSize: moderateScale(48),
    fontWeight: '600',
    color: '#000',
  },
}) => {
  const getBorderStyle = () => {
    if (!showBorder) {
      return styles.noBorder;
    }

    if (!isFree) {
      return styles.occupied;
    }
    return active ? styles.active : styles.free;
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled || (!isFree && showBorder)}
      style={{
        ...styles.box,
        ...getBorderStyle(),
        width,
        height,
        borderRadius,
      }}>
      <Text style={labelStyles}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBorder: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderWidth: 0,
  },
  free: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderWidth: dp(1),
    borderColor: 'green',
  },
  occupied: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderWidth: dp(1),
    borderColor: 'red',
  },
  active: {
    backgroundColor: 'rgba(191, 250, 0, 1)',
    borderWidth: dp(1),
    borderColor: 'green',
  },
  boxText: {
    fontSize: dp(48),
    fontWeight: '600',
    color: '#000',
  },
});

export {Box};
