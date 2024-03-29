import React, { useEffect, useState, useRef } from 'react';
import {View, StyleSheet, Text, Dimensions, Image, ActivityIndicator, Modal} from 'react-native';
import { Button } from '@styled/buttons';
import { CodeInput } from '@styled/inputs';

// Bottom Sheet Component
import { Popup, PopupRefProps } from '@components/Popup';

import { useAuth } from '@context/AuthContext';

import { useTheme } from '@context/ThemeProvider';

import { debounce } from '../../utils/debounce'
import { dp } from '../../utils/dp';
import Loader from "@components/Loader";
import Spinner from "react-native-loading-spinner-overlay/src";

interface VerificationProps {
  route: any;
}

const Verification = ({ route }: VerificationProps) => {

  const popRef = useRef<PopupRefProps>(null);

  // useEffect(() => {
  //   if (timerRef.current) {
  //     // Timer is already running, stop it
  //     stopTimer();
  //   } else {
  //     // Timer is not running, start it
  //     startTimer();
  //   }
  // }, [route])

  const context = useAuth();
  if ( ! context ) {
    return null;
  }

  const { sendOtp, register, login } = context;

  const { theme } = useTheme() as any

  const [code, setCode] = useState('');
  const [error, setError] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false);

  const verifyCode = async (otp: string) => {
    setLoading(true);
    if (otp.length === 4) {
      setCode(otp)
      const res = await login(route.params.phone, otp)

      console.log("RES -> ", res)
      setLoading(false);
      if (!res) {
        setLoading(false);
        setError(true)
      }

      switch(res) {
        case "register-required":
          popRef.current?.scrollTo(-500)
          break;
        case "wrong-otp":
          setError(true)
          setLoading(false);
          break;
        default:
          break;
      }
    }
  }

  // TODO: добавить счётчик
  // useEffect(() => {
  //   if (disabled) {
  //     debounce(50000, activateButton)
  //   }
  // }, [disabled])

  const activateButton = () => {
    setDisabled(false)
  }

  const [timer, setTimer] = useState(10);
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
      activateButton()
    } else if (timer === 10) {
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
  }, [timer])

  return (
    <View style={{...styles.container, backgroundColor: theme.mainColor}}>
      <View style={styles.topContainer}>
        <Image source={require("../../assets/icons/small-icon.png")} />
      </View>
      <Spinner
        visible={loading}
        color={'#0B68E1'}
        size={'large'}
      />
      <View style={styles.middleContainer}>
        <Text style={{...styles.text, color: theme.textColor}}>Введите код из СМС</Text>
        <Text style={styles.descriptionText}>Код отправлен на {route.params.phone}</Text>
        <CodeInput error={error} setError={setError} verify={verifyCode} />
        <View style={{paddingTop: dp(100)}}>
          <Button label="Получить новый код" color={!disabled ? "blue" : "grey"} disabled={!disabled ? false : true} onClick={() => {
              setDisabled(true)
              sendOtp(route.params.phone);
              setTimer(10)
            }}
          />
        </View>
        <View style={{paddingTop: dp(20)}}>
          <Text style={{alignSelf: "center"}}>Если код не придет,</Text>
          <Text>можно получить новый через {timer} сек.</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}></View>
      <Popup background="white" ref={popRef}>
          <View style={styles.popupHeader}>
            <Image source={require("../../assets/icons/terms.png")}  />
            <Text style={styles.termsText}>
              Даю согласие на обработку персональных данных
            </Text>
          </View>
          <View style={styles.popupHeader}>
            <Button label='ЗАРЕГИСТРИРОВАТЬСЯ' color="blue" onClick={() => {
              setLoading(true);
              register(code, route.params.phone, true, true);
              setLoading(false);
            }} />
          </View>
          <View style={styles.popupInfo}>
            <View style={styles.infoLine}>
              <Text style={styles.termsText}>Нажимая "Зарегистрироваться",</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.termsText}>Вы принимаете условия</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={{...styles.termsText, textDecorationLine: 'underline' }}>программы лояльности</Text>
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
    alignItems:'center'
  },
  middleContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    flex: 4,
    justifyContent: 'center',
    alignSelf: 'center', paddingTop: dp(20), width: dp(240)
  },
  header: {
    fontSize: dp(20),
    fontWeight: 'bold',
    color: '#20315f',
    paddingTop: dp(30),
  },
  phoneInputContainer: {
    alignSelf: 'center',
    width: Dimensions.get('window').width * 2 / 3,
    paddingTop: dp(50)
  },
  loginForm: {
      display: 'flex',
      justifyContent: 'center'
  },
  descriptionText: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: dp(16)
  },
  text: {
    fontSize: dp(24)
  },
  buttonActive: {
    backgroundColor: '#0B68E1'
  },
  buttonDisabled: {
    backgroundColor: '#A3A3A6'
  },
  popupHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: dp(20)
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
    color: "rgba(38, 38, 38, 1)"
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
});

export { Verification };
