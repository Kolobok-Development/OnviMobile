import {StyleSheet, View} from 'react-native';
import {dp} from '@utils/dp.ts';
import React, {useEffect, useRef, useState} from 'react';

const PostPyament = () => {
  return <View style={styles.container}>Hello</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: dp(22),
    display: 'flex',
    flexDirection: 'column',
  },
});
