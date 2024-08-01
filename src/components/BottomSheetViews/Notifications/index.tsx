import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';

import {Button} from '@styled/buttons';

const Notifications = () => {
  return (
    <View style={styles.container}>
      <Button label="История" onClick={() => {}} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('screen').height,
  },
});

export {Notifications};
