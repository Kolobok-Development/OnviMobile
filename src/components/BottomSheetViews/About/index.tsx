import {ScrollView as GHScrollView} from 'react-native-gesture-handler';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/metrics';
import {Platform} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
  import Config from 'react-native-config';
import {GeneralBottomSheetNavigationProp} from '../../../types/navigation/BottomSheetNavigation.ts';

const About = () => {
  const navigation = useNavigation<GeneralBottomSheetNavigationProp<'About'>>();

  return (
    <>
      <GHScrollView
        contentContainerStyle={[styles.container, {flexGrow: 1}]}
        nestedScrollEnabled={true}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../../../assets/icons/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/icons/onvi_log_black_green.png')}
              style={styles.logo}
            />
          </View>

          <Text style={[styles.text, styles.appName]}>onvi</Text>
    
          <View style={styles.section}>
            <Text style={styles.header}>Версия приложения</Text>
            <Text style={styles.text}>{Config.APP_VERSION}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Версия операционной системы</Text>
            <Text style={styles.text}>
              {`${Platform.OS} ${Platform.Version}`}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Регион</Text>
            <Text style={styles.text}>Россия</Text>
          </View>

          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.text}>Написать в поддержку</Text>
          </TouchableOpacity>
        </View>
      </GHScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 22,
    alignItems: 'center',
  },
  closeButtonContainer: {
    alignSelf: 'flex-start',
    paddingBottom: verticalScale(15),
    paddingLeft: horizontalScale(15),
    paddingTop: verticalScale(15),
  },
  closeButton: {
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: horizontalScale(15),
  },
  closeIcon: {
    width: horizontalScale(22),
    height: verticalScale(22),
    alignSelf: 'flex-start',
    resizeMode: 'contain',
  },
  contentContainer: {
    width: '90%',
    height: '55%',
    borderRadius: moderateScale(27),
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  logoContainer: {
    alignSelf: 'center',
    paddingBottom: verticalScale(15),
  },
  logo: {
    width: horizontalScale(91),
    height: verticalScale(51),
    resizeMode: 'contain',
    alignItems: 'center',
  },
  appName: {
    alignSelf: 'center',
    paddingBottom: verticalScale(15),
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: verticalScale(15),
  },
  header: {
    color: '#000000',
    fontSize: moderateScale(10),
    fontWeight: '400',
  },
  text: {
    color: '#000000',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  supportButton: {
    alignItems: 'center',
  },
});

export {About};
