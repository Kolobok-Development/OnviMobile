import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {dp} from '../../utils/dp';
import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {BackButton} from '@components/BackButton';

const About = () => {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            callback={() => {
              navigation.navigate('Настройки');
            }}
          />
          <Text style={styles.screenTitle}>О Нас</Text>
          <View style={{width: dp(50)}} />
        </View>
        <View style={styles.content}>
          <Image
            source={require('../../assets/icons/onvi_log_black_green.png')}
            style={styles.logo}
          />
          <Text style={{...styles.title}}>Onvi</Text>
          <View style={styles.section}>
            <Text style={{...styles.sectionTitle}}>Версия приложения</Text>
            <Text style={{...styles.text}}>1.0.4</Text>
          </View>
          <View style={styles.section}>
            <Text style={{...styles.sectionTitle}}>
              Версия операционной системы
            </Text>
            <Text
              style={{
                ...styles.text,
              }}>{`${Platform.OS} ${Platform.Version}`}</Text>
          </View>
          <View style={styles.section}>
            <Text style={{...styles.sectionTitle}}>Регион</Text>
            <Text style={{...styles.text}}>Россия</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            borderRadius: dp(12),
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
            padding: dp(10),
          }}
          onPress={() => Linking.openURL('https://t.me/+zW5dp29k0LYxZTUy')}>
          <Text
            style={{
              fontSize: dp(14),
              color: '#000000',
              fontWeight: '600',
              letterSpacing: 0.22,
            }}>
            Написать в поддержку
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    letterSpacing: 0.2,
    color: '#000',
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
  content: {
    marginTop: dp(30),
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {
    width: dp(91),
    height: dp(51),
    resizeMode: 'contain',
  },
  section: {
    alignItems: 'center',
    paddingBottom: dp(13),
  },
  title: {
    color: '#000000',
    fontSize: dp(18),
    fontWeight: '500',
  },
  text: {
    color: '#000000',
    fontSize: dp(10),
    fontWeight: '400',
  },
  sectionTitle: {
    color: '#000000',
    fontSize: dp(16),
    fontWeight: '600',
  },
});
export {About};
