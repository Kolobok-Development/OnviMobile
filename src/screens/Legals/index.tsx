import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import React from 'react';
import {BackButton} from '@components/BackButton';
import {useNavigation} from '@react-navigation/core';
import {GeneralDrawerNavigationProp} from '../../types/navigation/DrawerNavigation.ts';
import {openWebURL} from '@utils/openWebUrl.ts';

const Legals = () => {
  const navigation =
    useNavigation<GeneralDrawerNavigationProp<'Правовые документы'>>();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton
            callback={() => {
              navigation.navigate('Настройки');
            }}
          />
          <Text style={styles.screenTitle}>Правовые документы</Text>
          <View style={{width: dp(50)}} />
        </View>
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionBody}>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  style={[styles.row, styles.rowFirst]}
                  onPress={() => {
                    openWebURL(
                      'https://docs.google.com/document/d/1H5DFxDJfFBxK6wNK3iIydC9Qp1zaQsuSxZkjaPcCVyc/edit?usp=sharing',
                    );
                  }}>
                  <Text style={styles.rowLabel}>
                    Политика конфедициальности
                  </Text>
                  <Image
                    style={{
                      height: dp(24),
                      width: dp(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/icons/arrow-up.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rowWrapper}>
                <TouchableOpacity
                  style={[styles.row, styles.rowFirst]}
                  onPress={() =>
                    openWebURL(
                      'https://docs.google.com/document/d/1zqgcqbfsn7_64tUcD5iN7t9DkYt8YdqC/edit?usp=sharing&ouid=111405890257322006921&rtpof=true&sd=true',
                    )
                  }>
                  <Text style={styles.rowLabel}>Программа лояльнсти</Text>
                  <Image
                    style={{
                      height: dp(24),
                      width: dp(24),
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/icons/arrow-up.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
  content: {
    marginTop: '10%',
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(18),
    textAlignVertical: 'center',
    letterSpacing: 0.2,
    color: '#000',
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    marginLeft: dp(10),
    marginBottom: dp(10),
    fontSize: 13,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
    letterSpacing: 0.33,
  },
  sectionBody: {
    borderRadius: dp(10),
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: dp(10),
  },
  rowWrapper: {
    paddingLeft: dp(10),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderRadius: dp(10),
    borderColor: '#f0f0f0',
  },
  row: {
    height: dp(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: dp(5),
  },
  rowLabel: {
    fontSize: dp(13),
    letterSpacing: 0.22,
    color: '#000',
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

export {Legals};
