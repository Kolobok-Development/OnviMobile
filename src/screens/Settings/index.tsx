import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {dp} from '../../utils/dp';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useAuth} from '@context/AuthContext';
import {formatPhoneNumber} from '../../utils/phoneFormat';
import {Button, OnviSwitch} from '@styled/buttons';
import {Edit3, LogOut, Mail, User} from 'react-native-feather';
import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import {BurgerButton} from '@navigators/BurgerButton';
import {useAxios} from '@hooks/useAxios';
import Switch from '@styled/buttons/CustomSwitch';
import { Avatar } from "@styled/avatar";

const Settings = () => {
  const {store, getMe, signOut}: any = useAuth();
  const api = useAxios('CORE_URL');
  const navigation = useNavigation<any>();

  const initialUserName = store.name || '';
  const initialEmail = store.email || '';
  const initialPhone = store.phone || '';

  useEffect(() => {
    console.log(store.email);
  }, []);

  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%'], []);

  const handleClosePress = () => {
    setEditing(false);
    // @ts-ignore
    bottomSheetRef.current.close();
  };

  const saveUserDate = async () => {
    setLoading(true);
    try {
      const updateUser = await api.patch('/account', {
        name: userName,
        email: email,
      });

      console.log(updateUser.data);

      await getMe();
      setLoading(false);
      setEditing(false);
    } catch (error: any) {
      console.log(JSON.stringify(error));
      setLoading(false);
      setEditing(false);
    }
  };

  const onAboutButtonHandle = () => {
    navigation.navigate('О приложении');
  };

  const renderOverlay = () => {
    if (editing) {
      return <View style={styles.overlay} />;
    }
    return null;
  };

  const editingMode = () => {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        keyboardBlurBehavior="restore"
        // add bottom inset to elevate the sheet
        bottomInset={dp(Dimensions.get('window').height / 3)}
        // set `detached` to true
        detached={true}
        style={styles.sheetContainer}
        backgroundStyle={{borderRadius: dp(38)}}
        handleHeight={dp(30)}
        handleIndicatorStyle={{display: 'none'}}>
        <View style={styles.contentContainer}>
          <Text style={{...styles.titleText, marginBottom: dp(20)}}>
            Личные данные
          </Text>
          <View style={styles.textInputGroup}>
            <Text style={{padding: dp(10)}}>👤</Text>
            <BottomSheetTextInput
              value={userName}
              placeholder={'Имя'}
              onChangeText={(val: string) => {
                setUserName(val);
              }}
              style={styles.bottomSheetTextInput}
            />
          </View>
          <View style={styles.textInputGroup}>
            <Text style={{padding: dp(10)}}>📞</Text>
            <BottomSheetTextInput
              editable={false}
              value={formatPhoneNumber(phone)}
              placeholder={'Почта'}
              style={styles.bottomSheetTextInput}
            />
          </View>
          <View style={styles.textInputGroup}>
            <Text style={{padding: dp(10)}}>✉️</Text>
            <BottomSheetTextInput
              value={email}
              placeholder={'Почта'}
              onChangeText={(val: string) => {
                setEmail(val);
              }}
              style={styles.bottomSheetTextInput}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: dp(16),
            justifyContent: 'space-evenly',
          }}>
          <Button
            label={'Закрыть'}
            color={'blue'}
            width={dp(140)}
            height={dp(40)}
            fontSize={dp(16)}
            fontWeight={'600'}
            onClick={handleClosePress}
          />
          <Button
            label={'Сохранить'}
            color={'blue'}
            width={dp(140)}
            height={dp(40)}
            fontSize={dp(16)}
            fontWeight={'600'}
            disabled={loading}
            onClick={saveUserDate}
            showLoading={loading}
          />
        </View>
      </BottomSheet>
    );
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.header}>
        <BurgerButton isDrawerStack={true} />
        <Text style={styles.screenTitle}>Настройки</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={() => setEditing(true)}>
            <Edit3 height={dp(20)} width={dp(20)} stroke={'#000000'} />
          </TouchableOpacity>
          <Avatar source={require('../../assets/avatar_male.png')} style={styles.avatar} />
          <Text style={{...styles.titleText, marginTop: dp(18)}}>
            {userName}
          </Text>
          <Text style={{...styles.text, marginTop: dp(18)}}>
            {formatPhoneNumber(phone)}
          </Text>
          <Text style={{...styles.text}}>{email}</Text>
          <View style={styles.balance}>
            <Text style={styles.balanceText}>
              {store && store.balance ? store.balance : 0}
            </Text>
            <Image
              source={require('../../assets/icons/onvi_black.png')}
              style={styles.balanceIcon}
            />
          </View>
          <Text style={styles.text}>onvi бонусов</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.notification}>
            <Text style={styles.text}>Разрешить отправку уведомлений</Text>
            <Switch
              value={toggle}
              onValueChange={() => setToggle(!toggle)}
              activeText={''}
              inActiveText={''}
              backgroundActive="#000"
              backgroundInActive="#000"
              circleImageActive={require('../../assets/icons/small-icon.png')} // Replace with your image source
              circleImageInactive={require('../../assets/icons/small-icon.png')} // Replace with your image source
              circleSize={dp(18)} // Adjust the circle size as needed
              switchBorderRadius={20}
              width={dp(45)} // Adjust the switch width as needed
              textStyle={{fontSize: dp(13), color: 'white'}}
            />
          </View>
          <TouchableOpacity
            style={styles.btnAbout}
            onPress={onAboutButtonHandle}>
            <Text style={styles.text}>О приложении</Text>
            <Image
              style={{height: dp(24), width: dp(24), resizeMode: 'contain'}}
              source={require('../../assets/icons/arrow-up.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.footerBtns}>
          <TouchableOpacity style={styles.btnDelete}>
            <Text
              style={{fontSize: dp(10), fontWeight: '400', color: '#AFAEAE'}}>
              УДАЛИТЬ АККАУНТ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnExit} onPress={signOut}>
            <Text style={styles.text}>Выйти</Text>
            <LogOut height={dp(20)} width={dp(20)} stroke={'#000000'} />
          </TouchableOpacity>
        </View>
        {renderOverlay()}
        {editing && editingMode()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: dp(16),
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    textAlign: 'center',
    paddingLeft: dp(16),
    paddingTop: dp(16),
    paddingBottom: dp(3),
  },
  screenTitle: {
    fontWeight: '600',
    fontSize: dp(24),
    marginLeft: dp(15),
    textAlignVertical: 'center',
    color: '#000',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backImg: {
    width: dp(22),
    height: dp(22),
    resizeMode: 'contain',
  },
  profileCard: {
    display: 'flex',
    width: '100%',
    height: dp(397),
    alignItems: 'center',
    backgroundColor: '#BFFA00',
    borderRadius: dp(28),
    padding: dp(15),
  },
  avatar: {
    height: dp(70),
    width: dp(70),
    resizeMode: 'contain',
    marginTop: dp(60),
  },
  balance: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: dp(44),
  },
  balanceText: {
    fontSize: dp(36),
    fontWeight: '600',
    color: '#000000',
  },
  balanceIcon: {
    width: dp(28),
    height: dp(28),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: dp(5),
  },
  titleText: {
    fontSize: dp(24),
    fontWeight: '600',
    lineHeight: dp(24),
    color: '#000000',
    textAlign: 'center',
  },
  text: {
    fontSize: dp(14),
    fontWeight: '400',
    lineHeight: dp(20),
    color: '#000000',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    marginTop: dp(30),
    flexDirection: 'column',
    width: '100%',
  },
  notification: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: dp(10),
    paddingLeft: dp(10),
  },
  btnAbout: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: dp(40),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderRadius: dp(27),
    justifyContent: 'space-between',
    padding: dp(10),
    marginTop: dp(24),
  },
  footerBtns: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingBottom: dp(20),
  },
  btnDelete: {},
  btnExit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetContainer: {
    // add horizontal space
    marginHorizontal: dp(16),
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    padding: dp(10),
  },
  bottomSheetTextInput: {
    flex: 1,
    paddingTop: dp(10),
    paddingRight: dp(10),
    paddingBottom: dp(10),
    paddingLeft: dp(0),
    height: dp(40),
    fontSize: dp(16),
    fontWeight: '400',
    textAlign: 'left',
    padding: 6,
    color: '#000000',
    backgroundColor: '#F5F5F5',
    borderRadius: dp(30),
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black color
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: dp(15),
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: dp(30),
  },
});

export {Settings};
