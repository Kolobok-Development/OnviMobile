import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button} from '@styled/buttons';
import {PhoneInp} from '@styled/inputs';

import {useNavigation} from '@react-navigation/native';

import {useTheme} from '@context/ThemeProvider';

import {dp} from '@utils/dp';
import useStore from '@state/store';
import {GeneralAuthNavigationProp} from '@app-types/navigation/AuthNavigation.ts';

const SignIn = () => {
  const {sendOtp} = useStore.getState();
  const [isLoading, setIsLoading] = useState(false);
  const {t} = useTranslation();

  const {theme} = useTheme();

  const navigation = useNavigation<GeneralAuthNavigationProp<'SignIn'>>();

  const [phone, setPhone] = useState('');

  const validate = (number: string) => {
    if (number.length === 18) {
      return true;
    }

    return false;
  };

  const login = async () => {
    if (validate(phone)) {
      setIsLoading(true);
      sendOtp(phone)
        .then(() => {
          setIsLoading(false);
          navigation.navigate('Verify', {phone: phone, type: 'register'});
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.mainColor}}>
      <View style={styles.topContainer}>
        <Image source={require('../../assets/icons/small-icon.png')} />
      </View>
      <View style={styles.middleContainer}>
        <Text style={{...styles.text, color: theme.textColor}}>
          {t('app.auth.enterPhone')}
        </Text>
        <Text style={styles.descriptionText}>
          {t('app.auth.sendActivationCode')}
        </Text>

        <PhoneInp phoneNumber={phone} setPhoneNumber={setPhone} />
        <View style={{paddingTop: dp(100)}}>
          <Button
            label={t('common.buttons.next')}
            color={phone ? 'blue' : 'grey'}
            disabled={phone ? false : true}
            onClick={login}
            showLoading={isLoading}
          />
        </View>
      </View>
      <View style={styles.bottomContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: dp(20),
  },
  middleContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dp(30),
  },
  bottomContainer: {
    flex: 4,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: dp(20),
    width: dp(240),
  },
  header: {
    fontSize: dp(20),
    fontWeight: 'bold',
    color: '#20315f',
    paddingTop: dp(30),
  },
  phoneInputContainer: {
    alignSelf: 'center',
    width: (Dimensions.get('window').width * 2) / 3,
    paddingTop: dp(50),
  },
  loginForm: {
    display: 'flex',
    justifyContent: 'center',
  },
  descriptionText: {
    color: 'rgba(0, 0, 0, 1)',
    fontSize: dp(16),
  },
  text: {
    fontSize: dp(24),
  },
  buttonActive: {
    backgroundColor: '#0B68E1',
  },
  buttonDisabled: {
    backgroundColor: '#A3A3A6',
  },
});

export {SignIn};
