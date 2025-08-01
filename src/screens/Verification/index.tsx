import React, {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet, Text, Dimensions, Image} from 'react-native';
import {Button} from '@styled/buttons';

// Bottom Sheet Component
import {Popup, PopupRefProps} from '@components/Popup';

import {useTheme} from '@context/ThemeProvider';

import useStore from '@state/store';

import {dp} from '@utils/dp';
import Spinner from 'react-native-loading-spinner-overlay/src';
import {YELLOW} from '@utils/colors.ts';
import CheckBox from '@react-native-community/checkbox';
import {openWebURL} from '@utils/openWebUrl.ts';
import {OtpInput} from 'react-native-otp-entry';
import {useRoute} from '@react-navigation/native';
import {GeneralAuthRouteProp} from '@app-types/navigation/AuthNavigation.ts';

interface VerificationProps {}

const Verification = ({}: VerificationProps) => {
  const route = useRoute<GeneralAuthRouteProp<'Verify'>>();
  const popRef = useRef<PopupRefProps>(null);

  const {sendOtp, register, login} = useStore.getState();
  const {t} = useTranslation();

  const {theme} = useTheme();

  //OTP
  const [otpInput, setOtpInput] = useState<string>('');
  const inputRef = useRef<any>(null);

  const clear = () => inputRef.current?.clear();

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  //Registration
  const [isPersonalDataCollectionAccepted, setPersonalDataCollectionAccepted] =
    useState(true);

  const verifyCode = async (otp: string) => {
    setLoading(true);
    if (otp.length === 4) {
      const res = await login(route.params.phone, otp);

      setLoading(false);
      if (!res) {
        setLoading(false);
        //Vibration.vibrate(100);
        clear();
      }

      switch (res?.type) {
        case 'register-required':
          popRef.current?.scrollTo(-500);
          break;
        case 'wrong-otp':
          setLoading(false);
          break;
        default:
          break;
      }
    }
  };

  const activateButton = () => {
    setDisabled(false);
  };

  const [timer, setTimer] = useState(60);
  const timerRef: any = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000); // 50 seconds
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (timerRef.current && timer === 0) {
      // Timer is already running, stop it
      stopTimer();
      activateButton();
    } else if (timer === 60) {
      // Timer is not running, start it
      startTimer();
    }

    // if (timer === 0) {
    //   stopTimer()
    //   activateButton()
    // }
    // if (timer === 10) {
    //   // Timer is not running, start it
    //   startTimer();
    // }
  }, [timer]);

  useEffect(() => {
    if (otpInput.length === 4) {
      verifyCode(otpInput);
    }
  }, [otpInput]);

  return (
    <View style={{...styles.container, backgroundColor: theme.mainColor}}>
      <View style={styles.topContainer}>
        <Image source={require('../../assets/icons/small-icon.png')} />
      </View>
      <Spinner
        visible={loading}
        color={'#0B68E1'}
        size={'large'}
        overlayColor="rgba(0, 0, 0, 0.4)"
        textStyle={{zIndex: 9999}}
      />
      <View style={styles.middleContainer}>
        <Text style={{...styles.text, color: theme.textColor}}>
          {t('app.auth.enterSmsCode')}
        </Text>
        <Text style={styles.descriptionText}>
          {t('app.auth.codeSentTo')} {route.params.phone}
        </Text>
        <OtpInput
          numberOfDigits={4}
          focusColor={YELLOW}
          onFilled={otp => setOtpInput(otp)}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          type={'numeric'}
          theme={{
            containerStyle: {
              flexDirection: 'row',
              paddingLeft: dp(20),
              paddingRight: dp(40),
              marginTop: dp(40),
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flex: 1,
            },
            pinCodeContainerStyle: {
              width: dp(60),
              height: dp(60),
            },
          }}
        />
        <View style={{paddingTop: dp(100)}}>
          <Button
            label={t('app.auth.getNewCode')}
            color={!disabled ? 'blue' : 'grey'}
            disabled={!disabled ? false : true}
            onClick={() => {
              setDisabled(true);
              sendOtp(route.params.phone);
              setTimer(60);
            }}
          />
        </View>
        <View style={{paddingTop: dp(20)}}>
          <Text style={{alignSelf: 'center'}}>
            {t('app.auth.codeNotReceived')}
          </Text>
          <Text>{t('app.auth.canGetNewIn', {timer})}</Text>
        </View>
      </View>
      <View style={styles.bottomContainer} />
      <Popup background="white" ref={popRef}>
        <View style={styles.popupHeader}>
          <CheckBox
            value={isPersonalDataCollectionAccepted}
            onValueChange={newValue =>
              setPersonalDataCollectionAccepted(newValue)
            }
            style={styles.checkbox}
          />
          <Text style={styles.termsText}>
            {t('app.auth.dataProcessingConsent')}
          </Text>
        </View>
        <View style={styles.popupHeader}>
          <Button
            label={t('common.buttons.register')}
            color="blue"
            disabled={!isPersonalDataCollectionAccepted}
            onClick={() => {
              setLoading(true);
              register(otpInput, route.params.phone, true, true);
              setLoading(false);
            }}
          />
        </View>
        <View style={styles.popupInfo}>
          <View style={styles.infoLine}>
            <Text style={styles.termsText}>
              {t('app.auth.byClickingRegister')}
            </Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.termsText}>{t('app.auth.acceptTerms')}</Text>
          </View>
          <View style={styles.infoLine}>
            <Text
              style={{...styles.termsText, textDecorationLine: 'underline'}}
              onPress={() =>
                openWebURL(
                  'https://docs.google.com/document/d/1zqgcqbfsn7_64tUcD5iN7t9DkYt8YdqC/edit?usp=sharing&ouid=111405890257322006921&rtpof=true&sd=true',
                )
              }>
              {t('app.auth.loyaltyProgram')}
            </Text>
          </View>
        </View>
      </Popup>
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
    flex: 3,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
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
  popupHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: dp(20),
  },
  termsImage: {
    width: dp(20),
    height: dp(20),
  },
  termsText: {
    paddingLeft: dp(30),
    paddingRight: dp(30),
    fontSize: dp(16),
    fontWeight: '400',
    color: 'rgba(38, 38, 38, 1)',
  },
  popupInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  infoLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    marginTop: dp(25),
    width: '65%',
    gap: 10,
  },
  checkbox: {},
});

export {Verification};
